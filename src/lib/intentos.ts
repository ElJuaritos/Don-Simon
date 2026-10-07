import "server-only";
import { createHash } from "node:crypto";
import { and, count, eq, gt, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { intentos } from "@/db/schema";

const MAX = 10;
const VENTANA_MS = 15 * 60 * 1000;
const DIA_MS = 24 * 60 * 60 * 1000;

function secreto() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("Falta SESSION_SECRET (mínimo 32 caracteres) en .env.local");
  return s;
}

async function ipCliente() {
  const h = await headers();
  return h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
}

/**
 * Anota un intento y dice si todavía cabe en el límite (10 por IP cada 15 minutos).
 * La IP se guarda hasheada. Borra los registros de más de un día.
 */
export async function registrarIntento(tipo: "rastrear" | "devolucion") {
  const db = await getDb();
  const ahora = new Date();
  await db.delete(intentos).where(lt(intentos.createdAt, new Date(ahora.getTime() - DIA_MS)));

  const hashIp = createHash("sha256").update(`${secreto()}:${await ipCliente()}`).digest("hex");
  const desde = new Date(ahora.getTime() - VENTANA_MS);
  const [{ total }] = await db
    .select({ total: count() })
    .from(intentos)
    .where(and(eq(intentos.hashIp, hashIp), eq(intentos.tipo, tipo), gt(intentos.createdAt, desde)));

  if (Number(total) >= MAX) return false;
  await db.insert(intentos).values({ hashIp, tipo });
  return true;
}
