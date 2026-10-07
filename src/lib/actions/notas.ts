"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { notas } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getNota, slugNotaLibre } from "@/lib/data/notas";
import { slugify } from "@/lib/formato";
import { reemplazarFoto } from "@/lib/reemplazar-foto";
import { borrarImagen } from "@/lib/storage";
import type { EstadoForm } from "./tienda";

const schema = z.object({
  titulo: z.string().trim().min(2, "Escribe el título."),
  slug: z.string().trim().max(80),
  resumen: z.string().trim().max(300),
  cuerpo: z.string().trim().max(20000),
  imagenAlt: z.string().trim().max(200),
});

export async function guardarNota(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const id = z.uuid().safeParse(formData.get("id"));
  const actual = id.success ? await getNota(id.data) : null;
  if (id.success && !actual) return { error: "Nota no encontrada." };

  const base = slugify(parsed.data.slug || parsed.data.titulo);
  if (!base) return { error: "El enlace quedó vacío. Escribe un título." };
  const slug = await slugNotaLibre(base, actual?.id);
  if (parsed.data.slug && slug !== slugify(parsed.data.slug)) {
    return { error: "Ese enlace ya lo usa otra nota. Cámbialo." };
  }

  let imagenUrl: string | null | undefined;
  try {
    imagenUrl = await reemplazarFoto(formData, actual?.imagenUrl);
  } catch (e) {
    return { error: e instanceof Error ? e.message : "No se pudo subir la foto." };
  }

  const valores = {
    titulo: parsed.data.titulo,
    slug,
    resumen: parsed.data.resumen,
    cuerpo: parsed.data.cuerpo,
    imagenAlt: parsed.data.imagenAlt || parsed.data.titulo,
    ...(imagenUrl !== undefined && { imagenUrl }),
  };

  const db = await getDb();
  if (actual) {
    await db.update(notas).set(valores).where(eq(notas.id, actual.id));
    revalidatePath("/notas");
    revalidatePath(`/notas/${actual.slug}`);
    revalidatePath(`/notas/${slug}`);
    return { ok: true, mensaje: "Nota guardada." };
  }

  const [creada] = await db.insert(notas).values(valores).returning({ id: notas.id });
  revalidatePath("/notas");
  redirect(`/admin/notas/${creada.id}`);
}

async function cambiarEstado(id: string, estado: "publicada" | "borrador") {
  await requireAdmin();
  const actual = await getNota(id);
  if (!actual) return;
  const db = await getDb();
  await db
    .update(notas)
    .set({
      estado,
      ...(estado === "publicada" && !actual.publicadaEn ? { publicadaEn: new Date() } : {}),
    })
    .where(eq(notas.id, actual.id));
  revalidatePath("/notas");
  revalidatePath(`/notas/${actual.slug}`);
  revalidatePath("/", "layout");
}

export async function publicarNota(formData: FormData) {
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  await cambiarEstado(id.data, "publicada");
}

export async function volverBorrador(formData: FormData) {
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  await cambiarEstado(id.data, "borrador");
}

export async function borrarNota(formData: FormData) {
  await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  if (!id.success) return;
  const actual = await getNota(id.data);
  if (!actual) return;
  const db = await getDb();
  await db.delete(notas).where(eq(notas.id, actual.id));
  if (actual.imagenUrl) await borrarImagen(actual.imagenUrl);
  revalidatePath("/notas");
  revalidatePath("/", "layout");
  redirect("/admin/notas");
}
