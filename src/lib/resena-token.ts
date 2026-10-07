import "server-only";
import { errors, jwtVerify, SignJWT } from "jose";

// Enlace para dejar una reseña. Misma clave que la sesión del admin, pero con
// otra audiencia: un token de reseña no abre el panel, ni al revés.

const AUDIENCIA = "resena";
const DIAS = 120;

function secreto() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("Falta SESSION_SECRET (mínimo 32 caracteres) en .env.local");
  }
  return new TextEncoder().encode(s);
}

export async function firmarEnlaceResena(lineaId: string) {
  return new SignJWT({ lineaId })
    .setProtectedHeader({ alg: "HS256" })
    .setAudience(AUDIENCIA)
    .setIssuedAt()
    .setExpirationTime(`${DIAS}d`)
    .sign(secreto());
}

export type TokenResena = { ok: true; lineaId: string } | { ok: false; motivo: "vencido" | "invalido" };

export async function leerTokenResena(token: string): Promise<TokenResena> {
  try {
    const { payload } = await jwtVerify(token, secreto(), { audience: AUDIENCIA });
    if (typeof payload.lineaId !== "string" || !payload.lineaId) return { ok: false, motivo: "invalido" };
    return { ok: true, lineaId: payload.lineaId };
  } catch (e) {
    if (e instanceof errors.JWTExpired) return { ok: false, motivo: "vencido" };
    return { ok: false, motivo: "invalido" };
  }
}
