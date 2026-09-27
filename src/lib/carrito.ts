import "server-only";
import { eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";
import { getDb } from "@/db";
import { imagenes, productos, variantes } from "@/db/schema";
import { tienda } from "@/config/marca";
import { disponibles } from "@/lib/data/catalogo";

// El carrito vive en una cookie: solo guarda IDs de variante y cantidades.
// Precios y stock SIEMPRE se leen de la base de datos en el servidor.

const COOKIE = "ds_carrito";
const esquema = z.array(z.object({ v: z.uuid(), q: z.number().int().min(1).max(20) })).max(30);
export type ItemCookie = z.infer<typeof esquema>[number];

export async function leerCarrito(): Promise<ItemCookie[]> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = esquema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}

/** Solo desde Server Actions o Route Handlers */
export async function guardarCarrito(items: ItemCookie[]) {
  (await cookies()).set(COOKIE, JSON.stringify(items), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function vaciarCarrito() {
  (await cookies()).delete(COOKIE);
}

export async function contarCarrito() {
  return (await leerCarrito()).reduce((s, i) => s + i.q, 0);
}

export type LineaCarrito = {
  varianteId: string;
  productoId: string;
  slug: string;
  nombre: string;
  color: string;
  talla: number;
  sku: string;
  precioUnitario: number;
  cantidad: number;
  disponibles: number;
  imagen: { url: string; alt: string } | null;
  colorHex: string;
};

export function calcularEnvio(subtotal: number) {
  if (subtotal === 0) return 0;
  return subtotal >= tienda.envioGratisDesde ? 0 : tienda.costoEnvio;
}

export async function getCarritoDetallado() {
  const items = await leerCarrito();
  const lineas: LineaCarrito[] = [];

  if (items.length > 0) {
    const db = await getDb();
    const filas = await db
      .select({ variante: variantes, producto: productos })
      .from(variantes)
      .innerJoin(productos, eq(variantes.productoId, productos.id))
      .where(inArray(variantes.id, items.map((i) => i.v)));
    const imgs = filas.length
      ? await db
          .select()
          .from(imagenes)
          .where(inArray(imagenes.productoId, filas.map((f) => f.producto.id)))
      : [];

    for (const item of items) {
      const fila = filas.find((f) => f.variante.id === item.v);
      // Se descartan variantes borradas, desactivadas o de productos no activos
      if (!fila || !fila.variante.activo || fila.producto.estado !== "activo") continue;
      const { variante: v, producto: p } = fila;
      const propias = imgs
        .filter((i) => i.productoId === p.id)
        .sort((a, b) => a.orden - b.orden);
      const img = propias.find((i) => i.color === v.color) ?? propias[0] ?? null;
      lineas.push({
        varianteId: v.id,
        productoId: p.id,
        slug: p.slug,
        nombre: p.nombre,
        color: v.color,
        colorHex: v.colorHex,
        talla: v.talla,
        sku: v.sku,
        precioUnitario: p.precio,
        cantidad: item.q,
        disponibles: disponibles(v),
        imagen: img ? { url: img.url, alt: img.alt } : null,
      });
    }
  }

  const subtotal = lineas.reduce((s, l) => s + l.precioUnitario * l.cantidad, 0);
  const envio = calcularEnvio(subtotal);
  return {
    lineas,
    subtotal,
    envio,
    total: subtotal + envio,
    cantidad: lineas.reduce((s, l) => s + l.cantidad, 0),
    faltaParaEnvioGratis: Math.max(0, tienda.envioGratisDesde - subtotal),
    hayProblemasDeStock: lineas.some((l) => l.cantidad > l.disponibles),
  };
}

export type CarritoDetallado = Awaited<ReturnType<typeof getCarritoDetallado>>;
