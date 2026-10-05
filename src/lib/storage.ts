import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Imágenes subidas desde el admin.
// - Con SUPABASE_URL y SUPABASE_SECRET_KEY se guardan en Supabase Storage (bucket
//   público "media") y la base guarda su URL pública completa. Es lo que se usa en
//   Vercel, que no tiene disco persistente.
// - Sin ellas se guardan en .data/uploads y se sirven en /media/<archivo>.
// Las URL /media/... que ya estén en la base siguen funcionando en local.

const CARPETA = path.join(process.cwd(), ".data", "uploads");
const BUCKET = "media";
const TIPOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
export const MAX_BYTES = 8 * 1024 * 1024;
const NOMBRE_VALIDO = /^[\w-]+\.(jpg|png|webp|avif)$/;

function supabase() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const llave = process.env.SUPABASE_SECRET_KEY;
  if (!url || !llave) return null;
  return {
    objeto: (nombre: string) => `${url}/storage/v1/object/${BUCKET}/${nombre}`,
    publica: `${url}/storage/v1/object/public/${BUCKET}/`,
    // La llave va en los dos headers: así funciona tanto la nueva (sb_secret_...) como la heredada
    headers: { apikey: llave, Authorization: `Bearer ${llave}` },
  };
}

export async function guardarImagen(archivo: File) {
  const ext = TIPOS[archivo.type];
  if (!ext) throw new Error("Formato no permitido. Usa JPG, PNG, WebP o AVIF.");
  if (archivo.size > MAX_BYTES) throw new Error("La imagen pesa más de 8 MB.");
  const nombre = `${randomUUID()}.${ext}`;
  const datos = Buffer.from(await archivo.arrayBuffer());

  const sb = supabase();
  if (sb) {
    const res = await fetch(sb.objeto(nombre), {
      method: "POST",
      headers: { ...sb.headers, "Content-Type": archivo.type, "Cache-Control": "max-age=31536000" },
      body: datos,
    });
    if (!res.ok) {
      console.error("Supabase Storage:", res.status, await res.text().catch(() => ""));
      throw new Error("No se pudo subir la imagen. Intenta de nuevo.");
    }
    return sb.publica + nombre;
  }

  await mkdir(CARPETA, { recursive: true });
  await writeFile(path.join(CARPETA, nombre), datos);
  return `/media/${nombre}`;
}

export async function borrarImagen(url: string) {
  const sb = supabase();
  if (sb && url.startsWith(sb.publica)) {
    const nombre = url.slice(sb.publica.length);
    if (!NOMBRE_VALIDO.test(nombre)) return;
    await fetch(sb.objeto(nombre), { method: "DELETE", headers: sb.headers }).catch(() => {});
    return;
  }
  const nombre = url.replace(/^\/media\//, "");
  if (!NOMBRE_VALIDO.test(nombre)) return;
  await unlink(path.join(CARPETA, nombre)).catch(() => {});
}

export async function leerImagen(nombre: string) {
  if (!NOMBRE_VALIDO.test(nombre)) return null;
  try {
    const datos = await readFile(path.join(CARPETA, nombre));
    const ext = nombre.split(".").pop()!;
    const tipo = Object.entries(TIPOS).find(([, e]) => e === ext)![0];
    return { datos, tipo };
  } catch {
    return null;
  }
}
