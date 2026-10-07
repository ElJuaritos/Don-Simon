import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { tienda } from "@/config/marca";
import { getDb } from "@/db";
import {
  imagenes,
  pedidoLineas,
  pedidos,
  productos,
  resenas,
  variantes,
  type AnchoPie,
  type EstadoResena,
} from "@/db/schema";

export type ResumenResenas = {
  total: number;
  promedio: number;
  ajuste: number;
  distribucion: { estrellas: number; cantidad: number }[];
};

export type ResenaPublica = {
  id: string;
  nombre: string;
  ciudad: string | null;
  calificacion: number;
  titulo: string;
  texto: string;
  ajuste: number;
  anchoPie: AnchoPie;
  verificada: boolean;
  respuesta: string | null;
  fecha: string;
  producto: { nombre: string; slug: string; imagen: { url: string; alt: string } | null };
};

const vacio: ResumenResenas = {
  total: 0,
  promedio: 0,
  ajuste: 0,
  distribucion: [5, 4, 3, 2, 1].map((estrellas) => ({ estrellas, cantidad: 0 })),
};

function aNumero(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

async function resumenDonde(donde: ReturnType<typeof eq> | undefined): Promise<ResumenResenas> {
  const db = await getDb();
  const [fila] = await db
    .select({
      total: sql<number>`count(*)::int`,
      promedio: sql<string | null>`avg(${resenas.calificacion})`,
      ajuste: sql<string | null>`avg(${resenas.ajuste})`,
      c5: sql<number>`count(*) filter (where ${resenas.calificacion} = 5)::int`,
      c4: sql<number>`count(*) filter (where ${resenas.calificacion} = 4)::int`,
      c3: sql<number>`count(*) filter (where ${resenas.calificacion} = 3)::int`,
      c2: sql<number>`count(*) filter (where ${resenas.calificacion} = 2)::int`,
      c1: sql<number>`count(*) filter (where ${resenas.calificacion} = 1)::int`,
    })
    .from(resenas)
    .where(and(eq(resenas.estado, "publicada"), donde));
  const total = aNumero(fila?.total);
  if (!fila || total === 0) return vacio;
  return {
    total,
    promedio: aNumero(fila.promedio),
    ajuste: aNumero(fila.ajuste),
    distribucion: [
      { estrellas: 5, cantidad: aNumero(fila.c5) },
      { estrellas: 4, cantidad: aNumero(fila.c4) },
      { estrellas: 3, cantidad: aNumero(fila.c3) },
      { estrellas: 2, cantidad: aNumero(fila.c2) },
      { estrellas: 1, cantidad: aNumero(fila.c1) },
    ],
  };
}

export function resumenProducto(productoId: string) {
  return resumenDonde(eq(resenas.productoId, productoId));
}

export function resumenGlobal() {
  return resumenDonde(undefined);
}

/** Total publicado. Se deduplica en la misma petición (header y footer). */
export const totalPublicadas = cache(async () => {
  const db = await getDb();
  const [fila] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(resenas)
    .where(eq(resenas.estado, "publicada"));
  return aNumero(fila?.total);
});

export async function seMuestranResenas() {
  return (await totalPublicadas()) >= tienda.resenasMinimas;
}

async function fotosDe(ids: string[]) {
  if (ids.length === 0) return new Map<string, { url: string; alt: string }>();
  const db = await getDb();
  const fotos = await db
    .select({ productoId: imagenes.productoId, url: imagenes.url, alt: imagenes.alt, orden: imagenes.orden })
    .from(imagenes)
    .where(inArray(imagenes.productoId, ids))
    .orderBy(asc(imagenes.orden));
  const mapa = new Map<string, { url: string; alt: string }>();
  for (const f of fotos) if (!mapa.has(f.productoId)) mapa.set(f.productoId, { url: f.url, alt: f.alt });
  return mapa;
}

async function listarPublicadas(productoId?: string): Promise<ResenaPublica[]> {
  const db = await getDb();
  const filas = await db
    .select({
      id: resenas.id,
      nombre: resenas.nombre,
      ciudad: resenas.ciudad,
      calificacion: resenas.calificacion,
      titulo: resenas.titulo,
      texto: resenas.texto,
      ajuste: resenas.ajuste,
      anchoPie: resenas.anchoPie,
      verificada: resenas.verificada,
      respuesta: resenas.respuesta,
      createdAt: resenas.createdAt,
      productoId: productos.id,
      productoNombre: productos.nombre,
      slug: productos.slug,
    })
    .from(resenas)
    .innerJoin(productos, eq(productos.id, resenas.productoId))
    .where(and(eq(resenas.estado, "publicada"), productoId ? eq(resenas.productoId, productoId) : undefined))
    .orderBy(desc(resenas.createdAt));
  const fotos = await fotosDe([...new Set(filas.map((f) => f.productoId))]);
  return filas.map((f) => ({
    id: f.id,
    nombre: f.nombre,
    ciudad: f.ciudad,
    calificacion: f.calificacion,
    titulo: f.titulo,
    texto: f.texto,
    ajuste: f.ajuste,
    anchoPie: f.anchoPie,
    verificada: f.verificada,
    respuesta: f.respuesta,
    fecha: f.createdAt.toISOString(),
    producto: { nombre: f.productoNombre, slug: f.slug, imagen: fotos.get(f.productoId) ?? null },
  }));
}

export function listarPublicadasProducto(productoId: string) {
  return listarPublicadas(productoId);
}

export function listarPublicadasGlobal() {
  return listarPublicadas();
}

export async function contarPorEstado() {
  const db = await getDb();
  const filas = await db
    .select({ estado: resenas.estado, total: sql<number>`count(*)::int` })
    .from(resenas)
    .groupBy(resenas.estado);
  const conteo = { pendiente: 0, publicada: 0, rechazada: 0 };
  for (const f of filas) conteo[f.estado] = aNumero(f.total);
  return conteo;
}

export async function listarParaAdmin(estado: EstadoResena) {
  const db = await getDb();
  return db
    .select({
      id: resenas.id,
      nombre: resenas.nombre,
      ciudad: resenas.ciudad,
      calificacion: resenas.calificacion,
      titulo: resenas.titulo,
      texto: resenas.texto,
      ajuste: resenas.ajuste,
      anchoPie: resenas.anchoPie,
      verificada: resenas.verificada,
      respuesta: resenas.respuesta,
      createdAt: resenas.createdAt,
      productoNombre: productos.nombre,
      slug: productos.slug,
    })
    .from(resenas)
    .innerJoin(productos, eq(productos.id, resenas.productoId))
    .where(eq(resenas.estado, estado))
    .orderBy(desc(resenas.createdAt));
}

export async function lineasConResena(lineaIds: string[]) {
  if (lineaIds.length === 0) return new Set<string>();
  const db = await getDb();
  const filas = await db
    .select({ id: resenas.pedidoLineaId })
    .from(resenas)
    .where(inArray(resenas.pedidoLineaId, lineaIds));
  return new Set(filas.flatMap((f) => (f.id ? [f.id] : [])));
}

export async function productosParaResena() {
  const db = await getDb();
  return db
    .select({ id: productos.id, nombre: productos.nombre })
    .from(productos)
    .where(eq(productos.estado, "activo"))
    .orderBy(asc(productos.nombre));
}

/** Línea de un pedido entregado, lista para el formulario, o el motivo por el que no. */
export async function prepararResena(lineaId: string) {
  const db = await getDb();
  const [fila] = await db
    .select({
      lineaId: pedidoLineas.id,
      pedidoId: pedidos.id,
      estadoPedido: pedidos.estado,
      nombreCliente: pedidos.nombre,
      direccion: pedidos.direccion,
      nombreProducto: pedidoLineas.nombreProducto,
      color: pedidoLineas.color,
      talla: pedidoLineas.talla,
      productoId: variantes.productoId,
      slug: productos.slug,
      nombreModelo: productos.nombre,
    })
    .from(pedidoLineas)
    .innerJoin(pedidos, eq(pedidos.id, pedidoLineas.pedidoId))
    .leftJoin(variantes, eq(variantes.id, pedidoLineas.varianteId))
    .leftJoin(productos, eq(productos.id, variantes.productoId))
    .where(eq(pedidoLineas.id, lineaId));

  if (!fila) return { ok: false as const, motivo: "no-encontrado" as const };
  if (fila.estadoPedido !== "entregado") return { ok: false as const, motivo: "no-entregado" as const };
  if (!fila.productoId) return { ok: false as const, motivo: "no-encontrado" as const };

  const [ya] = await db
    .select({ id: resenas.id })
    .from(resenas)
    .where(eq(resenas.pedidoLineaId, lineaId));
  if (ya) return { ok: false as const, motivo: "usada" as const };

  const fotos = await fotosDe([fila.productoId]);
  const delColor = await db
    .select({ url: imagenes.url, alt: imagenes.alt })
    .from(imagenes)
    .where(and(eq(imagenes.productoId, fila.productoId), eq(imagenes.color, fila.color)))
    .orderBy(asc(imagenes.orden))
    .limit(1);

  return {
    ok: true as const,
    linea: {
      lineaId: fila.lineaId,
      pedidoId: fila.pedidoId,
      productoId: fila.productoId,
      nombre: fila.nombreModelo || fila.nombreProducto,
      slug: fila.slug ?? "",
      color: fila.color,
      talla: fila.talla,
      nombreCliente: fila.nombreCliente,
      ciudad: fila.direccion?.ciudad ?? "",
      imagen: delColor[0] ?? fotos.get(fila.productoId) ?? null,
    },
  };
}
