"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { bloques, categorias, hormas } from "@/db/schema";
import { definicionBloque } from "@/content/bloques";
import { requireAdmin } from "@/lib/auth";
import { getFilaBloque } from "@/lib/data/contenido";
import { borrarImagen, guardarImagen } from "@/lib/storage";
import type { EstadoForm } from "./tienda";

// Contenido editable: cuadros de la portada e historia, hormas y categorías.
// Como todas las Server Actions, cada una empieza con requireAdmin().

function refrescarTienda() {
  revalidatePath("/", "layout");
}

function archivoDe(formData: FormData, campo = "archivo") {
  const a = formData.get(campo);
  return a instanceof File && a.size > 0 ? a : null;
}

/**
 * Sube la foto nueva (si hay) o quita la actual (si se pidió) y borra el archivo anterior.
 * Devuelve la URL que debe guardarse, o undefined si la foto no cambia.
 */
async function reemplazarFoto(formData: FormData, anterior: string | null | undefined) {
  const nuevo = archivoDe(formData);
  if (nuevo) {
    const url = await guardarImagen(nuevo);
    if (anterior) await borrarImagen(anterior);
    return url;
  }
  if (formData.get("quitarImagen") === "on") {
    if (anterior) await borrarImagen(anterior);
    return null;
  }
  return undefined;
}

// Solo rutas internas o https: evita enlaces tipo "javascript:"
const enlaceSeguro = z
  .string()
  .trim()
  .refine((v) => v === "" || v.startsWith("/") || v.startsWith("https://"), {
    message: "El enlace debe empezar con / (página de la tienda) o con https://",
  });

const bloqueSchema = z.object({
  clave: z.string(),
  titulo: z.string().trim().max(160).optional(),
  texto: z.string().trim().max(3000).optional(),
  enlaceTexto: z.string().trim().max(60).optional(),
  enlaceUrl: enlaceSeguro.optional(),
  imagenAlt: z.string().trim().max(200).optional(),
});

export async function guardarBloque(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const parsed = bloqueSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;
  const def = definicionBloque(d.clave);
  if (!def) return { error: "Este cuadro no existe." };

  const anterior = await getFilaBloque(d.clave);
  let imagenUrl;
  try {
    imagenUrl = await reemplazarFoto(formData, anterior?.imagenUrl);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo subir la foto." };
  }

  // Solo se guardan los campos que este cuadro usa; el resto sigue con su valor por defecto
  const usa = (campo: (typeof def.campos)[number]) => def.campos.includes(campo);
  const valores = {
    ...(usa("titulo") && { titulo: d.titulo ?? "" }),
    ...(usa("texto") && { texto: d.texto ?? "" }),
    ...(usa("enlace") && { enlaceTexto: d.enlaceTexto ?? "", enlaceUrl: d.enlaceUrl ?? "" }),
    ...(usa("imagen") && { imagenAlt: d.imagenAlt ?? "" }),
    ...(imagenUrl !== undefined && { imagenUrl }),
  };

  const db = await getDb();
  await db
    .insert(bloques)
    .values({ clave: d.clave, ...valores })
    .onConflictDoUpdate({ target: bloques.clave, set: valores });
  refrescarTienda();
  return { ok: true, mensaje: "Guardado. Ya se ve en la tienda." };
}

/** Regresa un cuadro a sus textos originales y quita su foto. */
export async function restaurarBloque(formData: FormData) {
  await requireAdmin();
  const clave = String(formData.get("clave"));
  if (!definicionBloque(clave)) return;
  const db = await getDb();
  const [fila] = await db.delete(bloques).where(eq(bloques.clave, clave)).returning();
  if (fila?.imagenUrl) await borrarImagen(fila.imagenUrl);
  refrescarTienda();
}

// ---------- Hormas ----------

const hormaSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe el nombre de la horma."),
  recomendacion: z.string().trim().min(3, "Escribe la recomendación de talla."),
  ancho: z.enum(["estandar", "ancho"]),
  descripcion: z.string().trim().max(2000),
  orden: z.coerce.number().int().min(0).max(999),
});

export async function guardarHorma(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const parsed = hormaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = z.uuid().safeParse(formData.get("id"));
  const db = await getDb();
  const [actual] = id.success ? await db.select().from(hormas).where(eq(hormas.id, id.data)) : [];
  if (id.success && !actual) return { error: "Horma no encontrada." };

  let imagenUrl;
  try {
    imagenUrl = await reemplazarFoto(formData, actual?.imagenUrl);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo subir la foto." };
  }
  const valores = { ...parsed.data, ...(imagenUrl !== undefined && { imagenUrl }) };

  if (actual) {
    await db.update(hormas).set(valores).where(eq(hormas.id, actual.id));
  } else {
    await db.insert(hormas).values(valores);
  }
  refrescarTienda();
  return { ok: true, mensaje: actual ? "Horma actualizada." : `Horma "${parsed.data.nombre}" creada.` };
}

// ---------- Categorías ----------

const categoriaSchema = z.object({
  id: z.uuid(),
  nombre: z.string().trim().min(2, "Escribe el nombre de la categoría."),
  descripcion: z.string().trim().max(500),
  orden: z.coerce.number().int().min(0).max(999),
});

export async function guardarCategoria(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const parsed = categoriaSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const { id, ...datos } = parsed.data;

  const db = await getDb();
  const [actual] = await db.select().from(categorias).where(eq(categorias.id, id));
  if (!actual) return { error: "Categoría no encontrada." };

  let imagenUrl;
  try {
    imagenUrl = await reemplazarFoto(formData, actual.imagenUrl);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo subir la foto." };
  }
  // El slug no cambia al renombrar, para no romper enlaces ya compartidos
  await db
    .update(categorias)
    .set({ ...datos, ...(imagenUrl !== undefined && { imagenUrl }) })
    .where(eq(categorias.id, id));
  refrescarTienda();
  return { ok: true, mensaje: "Categoría actualizada." };
}
