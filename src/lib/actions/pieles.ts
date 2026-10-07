"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { pieles } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getPiel, slugPielLibre } from "@/lib/data/pieles";
import { slugify } from "@/lib/formato";
import { reemplazarFoto } from "@/lib/reemplazar-foto";
import { borrarImagen } from "@/lib/storage";
import type { EstadoForm } from "./tienda";

const schema = z.object({
  nombre: z.string().trim().min(2, "Escribe el nombre de la piel."),
  descripcion: z.string().trim().max(2000),
  cuidado: z.string().trim().max(2000),
  orden: z.coerce.number().int().min(0).max(999),
  activa: z.enum(["on"]).optional(),
});

export async function guardarPiel(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const parsed = schema.safeParse({
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    cuidado: formData.get("cuidado"),
    orden: formData.get("orden"),
    activa: formData.get("activa") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = z.uuid().safeParse(formData.get("id"));
  const actual = id.success ? await getPiel(id.data) : null;
  if (id.success && !actual) return { error: "Piel no encontrada." };

  let imagenUrl: string | null | undefined;
  try {
    imagenUrl = await reemplazarFoto(formData, actual?.imagenUrl);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo subir la foto." };
  }

  const db = await getDb();
  const valores = {
    nombre: parsed.data.nombre,
    descripcion: parsed.data.descripcion,
    cuidado: parsed.data.cuidado,
    orden: parsed.data.orden,
    activa: parsed.data.activa === "on",
    ...(imagenUrl !== undefined && { imagenUrl }),
  };

  if (actual) {
    await db.update(pieles).set(valores).where(eq(pieles.id, actual.id));
  } else {
    const slug = await slugPielLibre(slugify(parsed.data.nombre));
    await db.insert(pieles).values({ ...valores, slug });
  }
  revalidatePath("/pieles");
  revalidatePath("/", "layout");
  return { ok: true, mensaje: actual ? "Piel actualizada." : `Piel "${parsed.data.nombre}" creada.` };
}

export async function borrarPiel(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const actual = await getPiel(id.data);
  if (!actual) return;
  const db = await getDb();
  await db.delete(pieles).where(eq(pieles.id, actual.id));
  if (actual.imagenUrl) await borrarImagen(actual.imagenUrl);
  revalidatePath("/pieles");
  revalidatePath("/", "layout");
}
