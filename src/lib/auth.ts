import "server-only";
import { timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Acceso al admin con una contraseña (ADMIN_PASSWORD) y una sesión firmada en cookie.
// Es suficiente para el esqueleto; al conectar Supabase se cambia por Supabase Auth
// con usuarios individuales (docs/06-modelo-de-datos.md, "Usuarios del admin").

export const COOKIE_SESION = "ds_admin";
const DURACION_S = 60 * 60 * 12;

function secreto() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("Falta SESSION_SECRET (mínimo 32 caracteres) en .env.local");
  }
  return new TextEncoder().encode(s);
}

export function passwordCorrecta(intento: string) {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) throw new Error("Falta ADMIN_PASSWORD en .env.local");
  const a = Buffer.from(intento);
  const b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function iniciarSesion() {
  const token = await new SignJWT({ rol: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${DURACION_S}s`)
    .sign(secreto());
  (await cookies()).set(COOKIE_SESION, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACION_S,
  });
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE_SESION);
}

export async function esAdmin() {
  const token = (await cookies()).get(COOKIE_SESION)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secreto());
    return true;
  } catch {
    return false;
  }
}

/** Llamar al inicio de cada página y Server Action del admin. */
export async function requireAdmin() {
  if (!(await esAdmin())) redirect("/admin/login");
}
