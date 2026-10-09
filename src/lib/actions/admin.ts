"use server";

import { and, asc, eq, ilike, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import {
  categorias,
  imagenes,
  mensajes,
  pedidos,
  productos,
  productosComplementarios,
  variantes,
  ESTADOS_PRODUCTO,
  PUBLICOS,
  OCASIONES,
  type EstadoPedido,
  type Ocasion,
} from "@/db/schema";
import { cerrarSesion, iniciarSesion, passwordCorrecta, requireAdmin } from "@/lib/auth";
import { cancelarPedidoPendiente } from "@/lib/data/pedidos";
import { pesosACentavos, slugify, textoDeTalla } from "@/lib/formato";
import { borrarImagen, guardarImagen } from "@/lib/storage";
import { expirarSesion } from "@/lib/stripe";
import type { EstadoForm } from "./tienda";

// Cada acción empieza con requireAdmin(): las Server Actions son endpoints públicos.

function refrescarTienda() {
  revalidatePath("/", "layout");
}

// ---------- Sesión ----------

export async function login(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const password = String(formData.get("password") ?? "");
  // Pequeña espera para frenar intentos por fuerza bruta
  await new Promise((r) => setTimeout(r, 400));
  if (!passwordCorrecta(password)) return { error: "Contraseña incorrecta." };
  await iniciarSesion();
  redirect("/admin");
}

export async function logout() {
  await cerrarSesion();
  redirect("/admin/login");
}

// ---------- Productos ----------

const productoSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe el nombre del producto."),
  slug: z.string().trim().optional(),
  categoriaId: z.uuid("Elige una categoría."),
  hormaId: z.union([z.uuid(), z.literal("")]).optional(),
  precio: z.string(),
  precioComparacion: z.string().optional(),
  descripcion: z.string().trim(),
  materiales: z.string().trim(),
  construccion: z.string().trim().max(4000, "La construcción es muy larga. Resume en unos párrafos."),
  suela: z.string().trim(),
  cuidado: z.string().trim(),
  hechoEn: z.string().trim(),
  material: z.string().trim().max(80, "El material del filtro es muy largo. Usa una frase corta."),
  estado: z.enum(ESTADOS_PRODUCTO),
  publico: z.enum(PUBLICOS, "Elige para quién es el modelo."),
});

export async function guardarProducto(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const parsed = productoSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  const precio = pesosACentavos(d.precio);
  if (!Number.isFinite(precio) || precio <= 0) return { error: "Escribe un precio válido (ej. 3490)." };
  const precioComparacion = d.precioComparacion ? pesosACentavos(d.precioComparacion) : null;
  if (precioComparacion !== null && (!Number.isFinite(precioComparacion) || precioComparacion <= precio)) {
    return { error: "El precio anterior debe ser mayor que el precio actual (o déjalo vacío)." };
  }

  const id = formData.get("id") ? String(formData.get("id")) : null;
  const slug = slugify(d.slug || d.nombre);
  const db = await getDb();
  const [duplicado] = await db
    .select({ id: productos.id })
    .from(productos)
    .where(id ? and(eq(productos.slug, slug), ne(productos.id, id)) : eq(productos.slug, slug));
  if (duplicado) return { error: `Ya existe otro producto con la dirección "${slug}". Cambia el nombre o la dirección.` };

  const ocasiones = [...new Set(formData.getAll("ocasiones").map(String))].filter((o): o is Ocasion =>
    (OCASIONES as readonly string[]).includes(o),
  );

  const [categoria] = await db.select({ tipo: categorias.tipo }).from(categorias).where(eq(categorias.id, d.categoriaId));
  if (!categoria) return { error: "Elige una categoría." };

  const valores = {
    nombre: d.nombre,
    slug,
    categoriaId: d.categoriaId,
    hormaId: categoria.tipo === "accesorio" ? null : d.hormaId || null,
    precio,
    precioComparacion,
    descripcion: d.descripcion,
    materiales: d.materiales,
    material: d.material,
    ocasiones,
    construccion: d.construccion,
    suela: d.suela,
    cuidado: d.cuidado,
    hechoEn: d.hechoEn,
    destacado: formData.get("destacado") === "on",
    estado: d.estado,
    publico: d.publico,
  };

  if (id) {
    await db.update(productos).set(valores).where(eq(productos.id, id));
    refrescarTienda();
    return { ok: true, mensaje: "Cambios guardados." };
  }
  const [nuevo] = await db.insert(productos).values(valores).returning({ id: productos.id });
  refrescarTienda();
  redirect(`/admin/productos/${nuevo.id}?nuevo=1`);
}

const variantesSchema = z.object({
  productoId: z.uuid(),
  color: z.string().trim().min(1, "Escribe el color."),
  colorHex: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  tallaDesde: z.coerce.number().min(15).max(35),
  tallaHasta: z.coerce.number().min(15).max(35),
  stock: z.coerce.number().int().min(0).max(999),
});

export async function agregarVariantes(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const productoId = z.uuid().safeParse(formData.get("productoId"));
  if (!productoId.success) return { error: "Producto no encontrado." };

  const db = await getDb();
  const [fila] = await db
    .select({ producto: productos, tipo: categorias.tipo })
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(eq(productos.id, productoId.data));
  if (!fila) return { error: "Producto no encontrado." };
  if (fila.tipo === "accesorio") return agregarAccesorio(formData, fila.producto);

  const parsed = variantesSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;
  if (d.tallaHasta < d.tallaDesde) return { error: "La talla final debe ser mayor o igual a la inicial." };

  const paso = formData.get("medias") === "on" ? 0.5 : 1;
  const tallas: number[] = [];
  for (let t = d.tallaDesde; t <= d.tallaHasta + 0.001; t += paso) tallas.push(Math.round(t * 10) / 10);

  const codigo = slugify(fila.producto.nombre).replace(/-/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  const colorCod = slugify(d.color).replace(/-/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  const creadas = await db
    .insert(variantes)
    .values(
      tallas.map((talla) => ({
        productoId: fila.producto.id,
        color: d.color,
        colorHex: d.colorHex,
        talla,
        sku: `DS-${codigo}-${colorCod}-${talla * 10}-${fila.producto.id.slice(0, 4).toUpperCase()}`,
        stock: d.stock,
      })),
    )
    .onConflictDoNothing()
    .returning({ id: variantes.id });

  refrescarTienda();
  const omitidas = tallas.length - creadas.length;
  return {
    ok: true,
    mensaje: `Se agregaron ${creadas.length} tallas en ${d.color}.${omitidas ? ` ${omitidas} ya existían.` : ""}`,
  };
}

async function agregarAccesorio(
  formData: FormData,
  producto: { id: string; nombre: string },
): Promise<EstadoForm> {
  const color = String(formData.get("color") ?? "").trim();
  const colorHex = String(formData.get("colorHex") ?? "");
  const stock = Number(formData.get("stock"));
  const unica = formData.get("unica") === "on";
  const lineas = String(formData.get("etiquetas") ?? "")
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!color) return { error: "Escribe el color." };
  if (!/^#[0-9a-fA-F]{6}$/.test(colorHex)) return { error: "Elige el color de la muestra." };
  if (!Number.isInteger(stock) || stock < 0 || stock > 999) return { error: "Escribe cuántas piezas hay." };
  if (unica && lineas.length > 0) return { error: "Marca talla única o escribe las tallas, no las dos." };
  if (!unica && lineas.length === 0) return { error: "Marca talla única o escribe al menos una talla, por ejemplo 85 cm." };
  if (lineas.some((l) => l.length > 20)) return { error: "Cada talla debe ser corta, por ejemplo 85 cm." };

  const etiquetas = unica ? [null] : lineas;
  const codigo = slugify(producto.nombre).replace(/-/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  const colorCod = slugify(color).replace(/-/g, "").slice(0, 3).toUpperCase().padEnd(3, "X");
  const db = await getDb();
  const creadas = await db
    .insert(variantes)
    .values(
      etiquetas.map((etiqueta) => ({
        productoId: producto.id,
        color,
        colorHex,
        talla: null,
        etiquetaTalla: etiqueta,
        sku: `DS-${codigo}-${colorCod}-${slugify(etiqueta ?? "unica").replace(/-/g, "").slice(0, 6).toUpperCase() || "U"}-${producto.id.slice(0, 4).toUpperCase()}`,
        stock,
      })),
    )
    .onConflictDoNothing()
    .returning({ id: variantes.id });

  refrescarTienda();
  const omitidas = etiquetas.length - creadas.length;
  return {
    ok: true,
    mensaje: `Se agregó ${creadas.length === 1 ? "1 opción" : `${creadas.length} opciones`} en ${color}.${omitidas ? ` ${omitidas} ya existían.` : ""}`,
  };
}

export async function guardarInventario(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const productoId = z.uuid().parse(formData.get("productoId"));
  const db = await getDb();
  const propias = await db.select().from(variantes).where(eq(variantes.productoId, productoId));

  for (const v of propias) {
    const stock = Number(formData.get(`stock_${v.id}`));
    if (!Number.isInteger(stock) || stock < 0) return { error: `Stock inválido en ${v.color}, ${textoDeTalla(v)}.` };
    // No se puede bajar el stock por debajo de lo que ya está apartado en pedidos pendientes
    if (stock < v.stockApartado) {
      return { error: `${v.color}, ${textoDeTalla(v)}: hay ${v.stockApartado} apartados en pedidos pendientes.` };
    }
    const activo = formData.get(`activo_${v.id}`) === "on";
    if (stock !== v.stock || activo !== v.activo) {
      await db.update(variantes).set({ stock, activo }).where(eq(variantes.id, v.id));
    }
  }
  refrescarTienda();
  return { ok: true, mensaje: "Inventario actualizado." };
}

export async function subirImagenes(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const productoId = z.uuid().parse(formData.get("productoId"));
  const color = String(formData.get("color") ?? "") || null;
  const archivos = formData.getAll("archivos").filter((a): a is File => a instanceof File && a.size > 0);
  if (archivos.length === 0) return { error: "Elige al menos una imagen." };

  const db = await getDb();
  const [producto] = await db.select().from(productos).where(eq(productos.id, productoId));
  if (!producto) return { error: "Producto no encontrado." };
  const existentes = await db.select().from(imagenes).where(eq(imagenes.productoId, productoId));

  try {
    for (const [i, archivo] of archivos.entries()) {
      const url = await guardarImagen(archivo);
      await db.insert(imagenes).values({
        productoId,
        color,
        url,
        alt: `${producto.nombre}${color ? ` en color ${color.toLowerCase()}` : ""}`,
        orden: existentes.length + i,
      });
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo subir la imagen." };
  }
  refrescarTienda();
  return { ok: true, mensaje: `${archivos.length === 1 ? "Imagen subida" : `${archivos.length} imágenes subidas`}.` };
}

export async function eliminarImagen(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(formData.get("id"));
  const db = await getDb();
  const [img] = await db.delete(imagenes).where(eq(imagenes.id, id)).returning();
  if (img) await borrarImagen(img.url);
  refrescarTienda();
}

export async function hacerPrincipal(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(formData.get("id"));
  const db = await getDb();
  const [img] = await db.select().from(imagenes).where(eq(imagenes.id, id));
  if (!img) return;
  const todas = await db.select().from(imagenes).where(eq(imagenes.productoId, img.productoId));
  const orden = [img, ...todas.filter((i) => i.id !== img.id).sort((a, b) => a.orden - b.orden)];
  for (const [i, im] of orden.entries()) {
    await db.update(imagenes).set({ orden: i }).where(eq(imagenes.id, im.id));
  }
  refrescarTienda();
}

export async function buscarParaCombinar(consulta: string, productoId: string) {
  await requireAdmin();
  const texto = consulta.trim().replace(/[%_]/g, "");
  if (texto.length < 2 || !z.uuid().safeParse(productoId).success) return [];
  const db = await getDb();
  return db
    .select({ id: productos.id, nombre: productos.nombre })
    .from(productos)
    .where(and(ne(productos.id, productoId), ilike(productos.nombre, `%${texto}%`)))
    .orderBy(asc(productos.nombre))
    .limit(8);
}

export async function guardarComplementarios(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const productoId = z.uuid().safeParse(formData.get("productoId"));
  if (!productoId.success) return { error: "Producto no encontrado." };
  const ids = [...new Set(formData.getAll("complementarioId").map(String))]
    .filter((id) => z.uuid().safeParse(id).success && id !== productoId.data)
    .slice(0, 6);

  const db = await getDb();
  await db.delete(productosComplementarios).where(eq(productosComplementarios.productoId, productoId.data));
  if (ids.length > 0) {
    await db.insert(productosComplementarios).values(
      ids.map((complementarioId, orden) => ({ productoId: productoId.data, complementarioId, orden })),
    );
  }
  refrescarTienda();
  return { ok: true, mensaje: ids.length === 0 ? "Se quitaron las sugerencias." : "Combínalo con actualizado." };
}

// ---------- Categorías ----------

export async function crearCategoria(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const nombre = String(formData.get("nombre") ?? "").trim();
  const descripcion = String(formData.get("descripcion") ?? "").trim();
  if (nombre.length < 2) return { error: "Escribe el nombre de la categoría." };
  const tipo = formData.get("tipo") === "accesorio" ? "accesorio" : "calzado";
  const db = await getDb();
  const creada = await db
    .insert(categorias)
    .values({ nombre, descripcion, slug: slugify(nombre), orden: 99, tipo })
    .onConflictDoNothing()
    .returning();
  if (creada.length === 0) return { error: "Ya existe una categoría con ese nombre." };
  refrescarTienda();
  return { ok: true, mensaje: `Categoría "${nombre}" creada.` };
}

// ---------- Pedidos ----------

// Transiciones que el admin puede hacer a mano. "pagado" solo lo pone el webhook de Stripe.
const TRANSICIONES: Partial<Record<EstadoPedido, EstadoPedido[]>> = {
  pagado: ["en_preparacion"],
  en_preparacion: ["enviado"],
  enviado: ["entregado"],
  entregado: ["devuelto"],
};

export async function cambiarEstadoPedido(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const id = z.uuid().parse(formData.get("id"));
  const nuevo = String(formData.get("estado")) as EstadoPedido;
  const db = await getDb();
  const [pedido] = await db.select().from(pedidos).where(eq(pedidos.id, id));
  if (!pedido) return { error: "Pedido no encontrado." };

  if (nuevo === "cancelado" && pedido.estado === "pendiente_pago") {
    // Primero se cierra el pago en Stripe para que el cliente ya no pueda completarlo
    await expirarSesion(pedido.stripeSessionId);
    await cancelarPedidoPendiente(id);
    revalidatePath("/admin/pedidos");
    return { ok: true, mensaje: "Pedido cancelado y pares liberados." };
  }
  if (!TRANSICIONES[pedido.estado]?.includes(nuevo)) {
    return { error: "Ese cambio de estado no está permitido." };
  }

  const extra: Partial<typeof pedidos.$inferInsert> = {};
  if (nuevo === "enviado") {
    const paqueteria = String(formData.get("paqueteria") ?? "").trim();
    const numeroGuia = String(formData.get("numeroGuia") ?? "").trim();
    if (!paqueteria || !numeroGuia) return { error: "Escribe la paquetería y el número de guía." };
    Object.assign(extra, { paqueteria, numeroGuia, enviadoEn: new Date() });
  }
  await db
    .update(pedidos)
    .set({ estado: nuevo, ...extra })
    .where(and(eq(pedidos.id, id), eq(pedidos.estado, pedido.estado)));
  // TODO: correo al cliente con la guía (Resend, fase 4)
  revalidatePath("/admin/pedidos");
  return { ok: true, mensaje: "Pedido actualizado." };
}

// ---------- Mensajes ----------

export async function marcarLeido(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(formData.get("id"));
  const db = await getDb();
  await db.update(mensajes).set({ leido: true }).where(eq(mensajes.id, id));
  revalidatePath("/admin/mensajes");
}
