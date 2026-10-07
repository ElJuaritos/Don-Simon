"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { productos, resenas, ANCHOS_PIE, type EstadoResena } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { prepararResena } from "@/lib/data/resenas";
import { leerTokenResena } from "@/lib/resena-token";
import type { EstadoForm } from "./tienda";

const textoPlano = z
  .string()
  .trim()
  .transform((s) => s.replace(/\u0000/g, ""));

const campos = {
  calificacion: z.coerce.number().int().min(1).max(5),
  titulo: textoPlano.pipe(z.string().min(2, "El título es muy corto.").max(120)),
  texto: textoPlano.pipe(z.string().min(20, "Cuéntanos un poco más: al menos 20 caracteres.").max(2000)),
  ajuste: z.coerce.number().int().min(-2).max(2),
  anchoPie: z.enum(ANCHOS_PIE),
  nombre: textoPlano.pipe(z.string().min(2, "Escribe el nombre que quieres mostrar.").max(80)),
  ciudad: textoPlano.pipe(z.string().max(80)).optional(),
};

const esquemaPublico = z.object({ token: z.string().min(20), ...campos });
const esquemaManual = z.object({ productoId: z.uuid(), ...campos });

function ciudadONull(ciudad: string | undefined) {
  const c = ciudad?.trim();
  return c ? c : null;
}

async function refrescar(productoId?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/resenas");
  revalidatePath("/admin/resenas");
  if (!productoId) return;
  const db = await getDb();
  const [p] = await db.select({ slug: productos.slug }).from(productos).where(eq(productos.id, productoId));
  if (p) revalidatePath(`/producto/${p.slug}`);
}

/** Formulario público. Vuelve a validar el enlace y guarda la reseña como pendiente. */
export async function enviarResena(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const datos = esquemaPublico.safeParse({
    token: formData.get("token"),
    calificacion: formData.get("calificacion"),
    titulo: formData.get("titulo"),
    texto: formData.get("texto"),
    ajuste: formData.get("ajuste"),
    anchoPie: formData.get("anchoPie"),
    nombre: formData.get("nombre"),
    ciudad: formData.get("ciudad"),
  });
  if (!datos.success) return { error: datos.error.issues[0]?.message ?? "Revisa los campos." };

  const token = await leerTokenResena(datos.data.token);
  if (!token.ok) {
    return { error: token.motivo === "vencido" ? "Este enlace venció." : "Este enlace no es válido." };
  }
  const lista = await prepararResena(token.lineaId);
  if (!lista.ok) {
    if (lista.motivo === "usada") return { error: "Este enlace ya se usó." };
    if (lista.motivo === "no-entregado") return { error: "Este pedido todavía no se marca como entregado." };
    return { error: "No encontramos este pedido." };
  }

  const db = await getDb();
  try {
    await db.insert(resenas).values({
      productoId: lista.linea.productoId,
      pedidoId: lista.linea.pedidoId,
      pedidoLineaId: lista.linea.lineaId,
      nombre: datos.data.nombre,
      ciudad: ciudadONull(datos.data.ciudad),
      calificacion: datos.data.calificacion,
      titulo: datos.data.titulo,
      texto: datos.data.texto,
      ajuste: datos.data.ajuste,
      anchoPie: datos.data.anchoPie,
      estado: "pendiente",
      verificada: true,
    });
  } catch (e) {
    const codigo = (e as { code?: string; cause?: { code?: string } }).code ?? (e as { cause?: { code?: string } }).cause?.code;
    if (codigo === "23505") return { error: "Este enlace ya se usó." };
    throw e;
  }

  await revalidatePath("/admin/resenas");
  redirect(`/resena/${encodeURIComponent(datos.data.token)}?enviada=1`);
}

async function cambiarEstado(id: string, estado: EstadoResena) {
  await requireAdmin();
  const db = await getDb();
  const [fila] = await db.update(resenas).set({ estado }).where(eq(resenas.id, id)).returning({ productoId: resenas.productoId });
  if (fila) await refrescar(fila.productoId);
}

export async function publicarResena(formData: FormData) {
  const id = z.uuid().parse(formData.get("id"));
  await cambiarEstado(id, "publicada");
}

export async function rechazarResena(formData: FormData) {
  const id = z.uuid().parse(formData.get("id"));
  await cambiarEstado(id, "rechazada");
}

export async function volverPendiente(formData: FormData) {
  const id = z.uuid().parse(formData.get("id"));
  await cambiarEstado(id, "pendiente");
}

export async function responderResena(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const id = z.uuid().safeParse(formData.get("id"));
  const respuesta = textoPlano.pipe(z.string().max(2000)).safeParse(formData.get("respuesta"));
  if (!id.success || !respuesta.success) return { error: "No se pudo guardar la respuesta." };
  const texto = respuesta.data.trim();
  const db = await getDb();
  const [fila] = await db
    .update(resenas)
    .set({ respuesta: texto || null, respondidaEn: texto ? new Date() : null })
    .where(eq(resenas.id, id.data))
    .returning({ productoId: resenas.productoId });
  if (!fila) return { error: "No encontramos esa reseña." };
  await refrescar(fila.productoId);
  return { ok: true, mensaje: texto ? "Respuesta guardada." : "Respuesta quitada." };
}

/** Reseña capturada a mano (WhatsApp o en persona). No es compra verificada y entra pendiente. */
export async function agregarResenaManual(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await requireAdmin();
  const datos = esquemaManual.safeParse({
    productoId: formData.get("productoId"),
    calificacion: formData.get("calificacion"),
    titulo: formData.get("titulo"),
    texto: formData.get("texto"),
    ajuste: formData.get("ajuste"),
    anchoPie: formData.get("anchoPie"),
    nombre: formData.get("nombre"),
    ciudad: formData.get("ciudad"),
  });
  if (!datos.success) return { error: datos.error.issues[0]?.message ?? "Revisa los campos." };

  const db = await getDb();
  const [producto] = await db.select({ id: productos.id }).from(productos).where(eq(productos.id, datos.data.productoId));
  if (!producto) return { error: "Elige un producto." };

  await db.insert(resenas).values({
    productoId: datos.data.productoId,
    nombre: datos.data.nombre,
    ciudad: ciudadONull(datos.data.ciudad),
    calificacion: datos.data.calificacion,
    titulo: datos.data.titulo,
    texto: datos.data.texto,
    ajuste: datos.data.ajuste,
    anchoPie: datos.data.anchoPie,
    estado: "pendiente",
    verificada: false,
  });
  await refrescar(datos.data.productoId);
  return { ok: true, mensaje: "Reseña guardada. Está en Pendientes hasta que la publiques." };
}
