"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { mensajes } from "@/db/schema";
import { buscarPedidoPublico } from "@/lib/data/rastreo";
import { formatDia } from "@/lib/formato";
import { registrarIntento } from "@/lib/intentos";
import { MENSAJE_LIMITE, MENSAJE_PEDIDO_NO, MOTIVOS_DEVOLUCION, nombreEstadoPedido } from "@/lib/soporte";

export type EstadoRastreo = {
  error?: string;
  pedido?: {
    folio: string;
    fecha: string;
    estado: string;
    avance: number;
    paqueteria: string | null;
    numeroGuia: string | null;
    lineas: string[];
  };
};

const AVANCE: Record<string, number> = {
  pagado: 0,
  en_preparacion: 1,
  enviado: 2,
  entregado: 3,
};

export async function rastrearPedido(_prev: EstadoRastreo | undefined, formData: FormData): Promise<EstadoRastreo> {
  if (!(await registrarIntento("rastrear"))) return { error: MENSAJE_LIMITE };

  const folioTexto = String(formData.get("folio") ?? "");
  const email = String(formData.get("email") ?? "");
  const pedido = await buscarPedidoPublico(folioTexto, email);
  if (!pedido) return { error: MENSAJE_PEDIDO_NO };

  return {
    pedido: {
      folio: pedido.folio,
      fecha: formatDia(pedido.fecha),
      estado: nombreEstadoPedido(pedido.estado),
      avance: AVANCE[pedido.estado] ?? -1,
      paqueteria: pedido.paqueteria,
      numeroGuia: pedido.numeroGuia,
      lineas: pedido.lineas.map((l) => l.etiqueta),
    },
  };
}

export type EstadoDevolucion = {
  error?: string;
  mensaje?: string;
  folio?: string;
  email?: string;
  lineas?: string[];
};

const envioSchema = z.object({
  folio: z.string().trim().min(1),
  email: z.email(),
  par: z.string().trim().min(2, "Elige el par."),
  motivo: z.enum(["cambio_talla", "defecto", "no_me_gusto", "otro"]),
  tallaDeseada: z.string().trim().max(20),
  comentarios: z.string().trim().max(2000),
});

export async function enviarDevolucion(_prev: EstadoDevolucion | undefined, formData: FormData): Promise<EstadoDevolucion> {
  if (!(await registrarIntento("devolucion"))) return { error: MENSAJE_LIMITE };

  const folioTexto = String(formData.get("folio") ?? "");
  const email = String(formData.get("email") ?? "");
  const pedido = await buscarPedidoPublico(folioTexto, email);
  const sirve = pedido && (pedido.estado === "enviado" || pedido.estado === "entregado");
  if (!pedido || !sirve) return { error: MENSAJE_PEDIDO_NO };

  const lineas = pedido.lineas.map((l) => l.etiqueta);
  if (formData.get("paso") !== "enviar") {
    return { folio: pedido.folio, email: email.trim().toLowerCase(), lineas };
  }

  const parsed = envioSchema.safeParse({
    folio: pedido.folio,
    email: email.trim().toLowerCase(),
    par: formData.get("par"),
    motivo: formData.get("motivo"),
    tallaDeseada: formData.get("tallaDeseada") ?? "",
    comentarios: formData.get("comentarios") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message, folio: pedido.folio, email: email.trim().toLowerCase(), lineas };
  if (!lineas.includes(parsed.data.par)) {
    return { error: "Elige un par de este pedido.", folio: pedido.folio, email: parsed.data.email, lineas };
  }
  if (parsed.data.motivo === "cambio_talla" && !parsed.data.tallaDeseada) {
    return { error: "Escribe la talla que quieres.", folio: pedido.folio, email: parsed.data.email, lineas };
  }

  const motivo = MOTIVOS_DEVOLUCION.find((m) => m.valor === parsed.data.motivo)?.texto ?? parsed.data.motivo;
  const mensaje = [
    `Folio: ${pedido.folio}`,
    `Par: ${parsed.data.par}`,
    `Motivo: ${motivo}`,
    parsed.data.motivo === "cambio_talla" ? `Talla deseada: ${parsed.data.tallaDeseada}` : "",
    parsed.data.comentarios,
  ]
    .filter(Boolean)
    .join("\n");

  const db = await getDb();
  await db.insert(mensajes).values({
    tipo: "devolucion",
    nombre: "Cambio o devolución",
    email: parsed.data.email,
    telefono: "",
    mensaje,
  });
  revalidatePath("/admin/mensajes");
  return { mensaje: "Recibimos tu solicitud. Te escribimos para decirte cómo sigue." };
}
