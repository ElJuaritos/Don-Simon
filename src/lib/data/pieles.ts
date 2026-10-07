import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { cache } from "react";
import { getDb } from "@/db";
import { pieles } from "@/db/schema";

/** Pieles activas, en el orden del admin. */
export const getPielesActivas = cache(async () => {
  const db = await getDb();
  return db.select().from(pieles).where(eq(pieles.activa, true)).orderBy(asc(pieles.orden), asc(pieles.nombre));
});

export const getPieles = cache(async () => {
  const db = await getDb();
  return db.select().from(pieles).orderBy(asc(pieles.orden), asc(pieles.nombre));
});

export const hayPielesActivas = cache(async () => {
  const lista = await getPielesActivas();
  return lista.length > 0;
});

export async function slugPielLibre(base: string, idActual?: string) {
  const db = await getDb();
  const raiz = base || "piel";
  let slug = raiz;
  let n = 2;
  while (true) {
    const [otro] = await db.select({ id: pieles.id }).from(pieles).where(eq(pieles.slug, slug));
    if (!otro || otro.id === idActual) return slug;
    slug = `${raiz}-${n++}`;
  }
}

export async function getPiel(id: string) {
  const db = await getDb();
  const [fila] = await db.select().from(pieles).where(and(eq(pieles.id, id)));
  return fila ?? null;
}
