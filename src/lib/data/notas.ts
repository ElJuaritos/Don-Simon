import "server-only";
import { and, desc, eq, ne } from "drizzle-orm";
import { cache } from "react";
import { getDb } from "@/db";
import { notas } from "@/db/schema";

/** Notas publicadas, de la más nueva a la más vieja. */
export const getNotasPublicadas = cache(async () => {
  const db = await getDb();
  return db
    .select()
    .from(notas)
    .where(eq(notas.estado, "publicada"))
    .orderBy(desc(notas.publicadaEn), desc(notas.createdAt));
});

export const getNotaPublicada = cache(async (slug: string) => {
  const db = await getDb();
  const [fila] = await db
    .select()
    .from(notas)
    .where(and(eq(notas.slug, slug), eq(notas.estado, "publicada")));
  return fila ?? null;
});

export const hayNotasPublicadas = cache(async () => (await getNotasPublicadas()).length > 0);

export async function getNotasAdmin() {
  const db = await getDb();
  return db.select().from(notas).orderBy(desc(notas.updatedAt));
}

export async function getNota(id: string) {
  const db = await getDb();
  const [fila] = await db.select().from(notas).where(eq(notas.id, id));
  return fila ?? null;
}

/** La nota publicada justo más nueva y la justo más vieja, para los enlaces del final. */
export async function notasVecinas(slug: string) {
  const lista = await getNotasPublicadas();
  const i = lista.findIndex((n) => n.slug === slug);
  if (i < 0) return { anterior: null, siguiente: null };
  return {
    anterior: lista[i + 1] ?? null,
    siguiente: lista[i - 1] ?? null,
  };
}

export async function slugNotaLibre(base: string, idActual?: string) {
  const db = await getDb();
  const raiz = base || "nota";
  let slug = raiz;
  let n = 2;
  while (idActual) {
    const [otro] = await db.select({ id: notas.id }).from(notas).where(and(eq(notas.slug, slug), ne(notas.id, idActual)));
    if (!otro) return slug;
    slug = `${raiz}-${n++}`;
  }
  while (true) {
    const [otro] = await db.select({ id: notas.id }).from(notas).where(eq(notas.slug, slug));
    if (!otro) return slug;
    slug = `${raiz}-${n++}`;
  }
}
