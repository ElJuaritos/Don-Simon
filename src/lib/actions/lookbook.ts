"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { lookbookFotos, productos, PUBLICOS } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getFotoLookbook } from "@/lib/data/lookbook";
import { borrarImagen, guardarImagen } from "@/lib/storage";
import type { EstadoForm } from "./tienda";

function refrescar() {
  revalidatePath("/lookbook");
  revalidatePath("/admin/lookbook");
}

const fotoSchema = z.object({
  id: z.string().uuid().optional().or(z.literal("")),
  alt: z.string().trim().min(3, "Describe la foto en una frase corta."),
  publico: z.enum(PUBLICOS),
  productoId: z.string().uuid().or(z.literal("")).optional(),
  orden: z.coerce.number().int().min(0).max(999),
  activa: z.string().optional(),
});

/** Crea o actualiza una foto del lookbook. La foto nueva es obligatoria al crear. */
export async function guardarLookbookFoto(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const parsed = fotoSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    alt: formData.get("alt"),
    publico: formData.get("publico"),
    productoId: String(formData.get("productoId") ?? ""),
    orden: formData.get("orden"),
    activa: formData.get("activa") ? String(formData.get("activa")) : undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const d = parsed.data;
  const id = d.id || undefined;
  const anterior = id ? await getFotoLookbook(id) : null;
  if (id && !anterior) return { error: "No encontramos esa foto." };

  const archivo = formData.get("archivo");
  const nuevo = archivo instanceof File && archivo.size > 0 ? archivo : null;
  if (!anterior && !nuevo) return { error: "Sube una foto." };

  let imagenUrl = anterior?.imagenUrl ?? null;
  try {
    if (nuevo) {
      imagenUrl = await guardarImagen(nuevo);
      if (anterior?.imagenUrl) await borrarImagen(anterior.imagenUrl);
    } else if (formData.get("quitarImagen") === "on" && anterior?.imagenUrl) {
      await borrarImagen(anterior.imagenUrl);
      imagenUrl = null;
    }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo subir la foto." };
  }

  const productoId = d.productoId || null;
  if (productoId) {
    const db = await getDb();
    const [producto] = await db.select({ id: productos.id }).from(productos).where(eq(productos.id, productoId));
    if (!producto) return { error: "Elige un producto de la lista." };
  }

  const valores = {
    alt: d.alt,
    publico: d.publico,
    productoId,
    orden: d.orden,
    activa: d.activa === "on",
    imagenUrl,
  };

  const db = await getDb();
  if (anterior) {
    await db.update(lookbookFotos).set(valores).where(eq(lookbookFotos.id, anterior.id));
  } else {
    await db.insert(lookbookFotos).values(valores);
  }
  refrescar();
  return { ok: true, mensaje: anterior ? "Guardado. Ya se ve en el lookbook." : "Foto agregada." };
}

export async function eliminarLookbookFoto(formData: FormData) {
  await requireAdmin();
  const id = z.string().uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const db = await getDb();
  const [fila] = await db.delete(lookbookFotos).where(eq(lookbookFotos.id, id.data)).returning();
  if (fila?.imagenUrl) await borrarImagen(fila.imagenUrl);
  refrescar();
}
