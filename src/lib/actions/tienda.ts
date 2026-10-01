"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { z } from "zod";
import { getDb } from "@/db";
import { mensajes, pedidos, productos, suscriptores, variantes } from "@/db/schema";
import { tienda } from "@/config/marca";
import {
  detallarCarrito,
  getCarritoDetallado,
  guardarCarrito,
  leerCarrito,
  vaciarCarrito,
  type CarritoDetallado,
} from "@/lib/carrito";
import { disponibles } from "@/lib/data/catalogo";
import { cancelarPedidoPendiente, crearPedido, SinStockError } from "@/lib/data/pedidos";
import { folio } from "@/lib/formato";
import { esModoDemo, getStripe, urlDelSitio } from "@/lib/stripe";

export type EstadoForm = { ok?: boolean; error?: string; mensaje?: string } | undefined;

// ---------- Carrito ----------

export type EstadoAgregar =
  | (NonNullable<EstadoForm> & {
      /** Carrito actualizado, para mostrarlo en el panel lateral sin otra consulta */
      carrito?: CarritoDetallado;
      agregadoId?: string;
    })
  | undefined;

export async function agregarAlCarrito(_prev: EstadoAgregar, formData: FormData): Promise<EstadoAgregar> {
  const varianteId = z.uuid().safeParse(formData.get("varianteId"));
  if (!varianteId.success) return { error: "Elige una talla." };

  const db = await getDb();
  const [fila] = await db
    .select({ variante: variantes, estado: productos.estado })
    .from(variantes)
    .innerJoin(productos, eq(variantes.productoId, productos.id))
    .where(eq(variantes.id, varianteId.data));
  if (!fila || fila.estado !== "activo" || !fila.variante.activo) {
    return { error: "Este producto ya no está disponible." };
  }

  const items = await leerCarrito();
  const existente = items.find((i) => i.v === varianteId.data);
  const nueva = (existente?.q ?? 0) + 1;
  const max = Math.min(disponibles(fila.variante), tienda.maxParesPorLinea);
  if (nueva > max) {
    return { error: max === 0 ? "Esta talla está agotada." : "No hay más pares disponibles en esta talla." };
  }
  if (existente) existente.q = nueva;
  else items.push({ v: varianteId.data, q: 1 });
  await guardarCarrito(items);
  return { ok: true, mensaje: "Agregado al carrito", carrito: await detallarCarrito(items), agregadoId: varianteId.data };
}

export async function cambiarCantidad(formData: FormData) {
  const v = String(formData.get("varianteId"));
  const q = Number(formData.get("cantidad"));
  let items = await leerCarrito();
  if (!Number.isInteger(q) || q <= 0) items = items.filter((i) => i.v !== v);
  else items = items.map((i) => (i.v === v ? { ...i, q: Math.min(q, tienda.maxParesPorLinea) } : i));
  await guardarCarrito(items);
}

export async function limpiarCarrito() {
  await vaciarCarrito();
}

// ---------- Checkout ----------

const checkoutSchema = z.object({
  email: z.email("Escribe un correo válido."),
  nombre: z.string().trim().min(3, "Escribe tu nombre completo."),
  telefono: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]{10,20}$/, "Escribe un teléfono de 10 dígitos."),
  calle: z.string().trim().min(2, "Escribe la calle."),
  numeroExt: z.string().trim().min(1, "Escribe el número exterior."),
  numeroInt: z.string().trim().optional(),
  colonia: z.string().trim().min(2, "Escribe la colonia."),
  codigoPostal: z.string().trim().regex(/^\d{5}$/, "El código postal debe tener 5 dígitos."),
  ciudad: z.string().trim().min(2, "Escribe la ciudad o municipio."),
  estado: z.string().trim().min(2, "Elige el estado."),
  referencias: z.string().trim().max(300).optional(),
  notas: z.string().trim().max(500).optional(),
});

export async function iniciarCheckout(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const parsed = checkoutSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const stripe = getStripe();
  if (!stripe && !esModoDemo()) {
    return { error: "Los pagos no están disponibles en este momento. Intenta más tarde." };
  }

  // Precios y totales se recalculan aquí, nunca se confía en el navegador
  const carrito = await getCarritoDetallado();
  if (carrito.lineas.length === 0) return { error: "Tu carrito está vacío." };

  let pedido;
  try {
    pedido = await crearPedido({
      email: d.email,
      nombre: d.nombre,
      telefono: d.telefono,
      direccion: {
        calle: d.calle,
        numeroExt: d.numeroExt,
        numeroInt: d.numeroInt,
        colonia: d.colonia,
        codigoPostal: d.codigoPostal,
        ciudad: d.ciudad,
        estado: d.estado,
        referencias: d.referencias,
      },
      notas: d.notas ?? "",
      lineas: carrito.lineas,
      subtotal: carrito.subtotal,
      envio: carrito.envio,
      total: carrito.total,
    });
  } catch (e) {
    if (e instanceof SinStockError) return { error: `${e.message} Ajusta tu carrito.` };
    throw e;
  }

  if (!stripe) {
    // Modo demo (solo desarrollo): el pedido queda "pendiente de pago"
    await vaciarCarrito();
    redirect(`/checkout/gracias?pedido=${pedido.id}&demo=1`);
  }

  let sesion;
  try {
    sesion = await crearSesionPago(stripe, pedido, carrito, d.email);
  } catch (e) {
    // Sin sesión de pago no llegará ningún webhook: hay que liberar los pares aquí
    console.error("No se pudo crear la sesión de Stripe", e);
    await cancelarPedidoPendiente(pedido.id);
    return { error: "No pudimos conectar con el sistema de pago. Intenta de nuevo en unos minutos." };
  }

  const db = await getDb();
  await db.update(pedidos).set({ stripeSessionId: sesion.id }).where(eq(pedidos.id, pedido.id));
  redirect(sesion.url!);
}

function crearSesionPago(
  stripe: Stripe,
  pedido: { id: string; numero: number },
  carrito: CarritoDetallado,
  email: string,
) {
  const sitio = urlDelSitio();
  const envio = carrito.envio > 0
    ? [{ quantity: 1, price_data: { currency: "mxn", unit_amount: carrito.envio, product_data: { name: "Envío" } } }]
    : [];
  return stripe.checkout.sessions.create({
    mode: "payment",
    locale: "es",
    customer_email: email,
    client_reference_id: pedido.id,
    metadata: { pedidoId: pedido.id, folio: folio(pedido.numero) },
    payment_intent_data: { metadata: { pedidoId: pedido.id } },
    line_items: [
      ...carrito.lineas.map((l) => ({
        quantity: l.cantidad,
        price_data: {
          currency: "mxn",
          unit_amount: l.precioUnitario,
          product_data: { name: `${l.nombre} · ${l.color} · Talla ${l.talla}` },
        },
      })),
      ...envio,
    ],
    // El ID del pedido es un UUID: no se puede adivinar como un folio consecutivo
    success_url: `${sitio}/checkout/gracias?pedido=${pedido.id}`,
    cancel_url: `${sitio}/carrito?pago=cancelado`,
  });
}

// ---------- Newsletter y contacto ----------

export async function suscribir(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const email = z.email().safeParse(formData.get("email"));
  if (!email.success) return { error: "Escribe un correo válido." };
  const db = await getDb();
  await db
    .insert(suscriptores)
    .values({ email: email.data.toLowerCase(), origen: String(formData.get("origen") ?? "footer") })
    .onConflictDoNothing();
  return { ok: true, mensaje: "¡Gracias! Te escribiremos pronto." };
}

const contactoSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre."),
  email: z.email("Escribe un correo válido."),
  telefono: z.string().trim().max(20).optional(),
  mensaje: z.string().trim().min(10, "Cuéntanos un poco más (mínimo 10 caracteres).").max(2000),
});

export async function enviarMensaje(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const parsed = contactoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const db = await getDb();
  await db.insert(mensajes).values({ ...parsed.data, telefono: parsed.data.telefono ?? "" });
  return { ok: true, mensaje: "Recibimos tu mensaje. Te respondemos en menos de 24 horas hábiles." };
}
