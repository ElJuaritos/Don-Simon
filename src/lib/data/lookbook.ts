import "server-only";
import { and, asc, eq, ne, or } from "drizzle-orm";
import { getDb } from "@/db";
import { lookbookFotos, productos, type Publico } from "@/db/schema";

export type FotoLookbook = {
  id: string;
  alt: string;
  imagen: { url: string; alt: string } | null;
  publico: Publico;
  producto: { slug: string; nombre: string } | null;
};

/** Fotos visibles del lookbook. «Hombre» y «Mujer» incluyen también las de ambos. */
export async function getLookbook(para?: "hombre" | "mujer"): Promise<FotoLookbook[]> {
  const db = await getDb();
  const condiciones = [eq(lookbookFotos.activa, true)];
  if (para) condiciones.push(or(eq(lookbookFotos.publico, para), eq(lookbookFotos.publico, "unisex"))!);

  const filas = await db
    .select({
      id: lookbookFotos.id,
      alt: lookbookFotos.alt,
      imagenUrl: lookbookFotos.imagenUrl,
      publico: lookbookFotos.publico,
      slug: productos.slug,
      nombre: productos.nombre,
      estado: productos.estado,
    })
    .from(lookbookFotos)
    .leftJoin(productos, eq(lookbookFotos.productoId, productos.id))
    .where(and(...condiciones))
    .orderBy(asc(lookbookFotos.orden), asc(lookbookFotos.createdAt));

  return filas.map((f) => ({
    id: f.id,
    alt: f.alt,
    imagen: f.imagenUrl ? { url: f.imagenUrl, alt: f.alt } : null,
    publico: f.publico,
    producto: f.slug && f.estado === "activo" ? { slug: f.slug, nombre: f.nombre ?? "" } : null,
  }));
}

export async function getLookbookAdmin() {
  const db = await getDb();
  return db
    .select({
      foto: lookbookFotos,
      productoNombre: productos.nombre,
    })
    .from(lookbookFotos)
    .leftJoin(productos, eq(lookbookFotos.productoId, productos.id))
    .orderBy(asc(lookbookFotos.orden), asc(lookbookFotos.createdAt));
}

export async function getProductosParaEnlace() {
  const db = await getDb();
  return db
    .select({ id: productos.id, nombre: productos.nombre })
    .from(productos)
    .where(ne(productos.estado, "archivado"))
    .orderBy(asc(productos.nombre));
}

export async function getFotoLookbook(id: string) {
  const db = await getDb();
  const [fila] = await db.select().from(lookbookFotos).where(eq(lookbookFotos.id, id));
  return fila ?? null;
}
