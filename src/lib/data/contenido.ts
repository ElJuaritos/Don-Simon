import "server-only";
import { asc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { bloques, hormas } from "@/db/schema";
import { BLOQUES, type DefinicionBloque, type GrupoBloque } from "@/content/bloques";

// Contenido editable desde el admin: cuadros de portada/historia y hormas.

export type BloqueResuelto = {
  clave: string;
  titulo: string;
  texto: string;
  enlaceTexto: string;
  enlaceUrl: string;
  imagen: { url: string; alt: string } | null;
  notaFoto?: string;
};

/** Mezcla el texto por defecto con lo guardado en la BD (lo guardado gana, aunque esté vacío). */
function resolver(def: DefinicionBloque, fila?: typeof bloques.$inferSelect): BloqueResuelto {
  const d = def.defecto;
  return {
    clave: def.clave,
    titulo: fila?.titulo ?? d.titulo ?? "",
    texto: fila?.texto ?? d.texto ?? "",
    enlaceTexto: fila?.enlaceTexto ?? d.enlaceTexto ?? "",
    enlaceUrl: fila?.enlaceUrl ?? d.enlaceUrl ?? "",
    imagen: fila?.imagenUrl ? { url: fila.imagenUrl, alt: fila.imagenAlt || d.imagenAlt || "" } : null,
    notaFoto: def.notaFoto,
  };
}

/** Todos los cuadros de un grupo, indexados por clave. */
export async function getBloques(grupo: GrupoBloque): Promise<Record<string, BloqueResuelto>> {
  const defs = BLOQUES.filter((b) => b.grupo === grupo);
  const db = await getDb();
  const filas = await db
    .select()
    .from(bloques)
    .where(inArray(bloques.clave, defs.map((d) => d.clave)));
  return Object.fromEntries(defs.map((def) => [def.clave, resolver(def, filas.find((f) => f.clave === def.clave))]));
}

export async function getFilaBloque(clave: string) {
  const db = await getDb();
  const [fila] = await db.select().from(bloques).where(eq(bloques.clave, clave));
  return fila ?? null;
}

export async function getHormas() {
  const db = await getDb();
  return db.select().from(hormas).orderBy(asc(hormas.orden), asc(hormas.nombre));
}
