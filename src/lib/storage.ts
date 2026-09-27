import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Imágenes subidas desde el admin. En local se guardan en .data/uploads y se sirven
// en /media/<archivo>. En producción (Vercel no tiene disco persistente) esto se
// cambia por Supabase Storage sin tocar el resto del código.

const CARPETA = path.join(process.cwd(), ".data", "uploads");
const TIPOS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
export const MAX_BYTES = 8 * 1024 * 1024;

export async function guardarImagen(archivo: File) {
  const ext = TIPOS[archivo.type];
  if (!ext) throw new Error("Formato no permitido. Usa JPG, PNG, WebP o AVIF.");
  if (archivo.size > MAX_BYTES) throw new Error("La imagen pesa más de 8 MB.");
  await mkdir(CARPETA, { recursive: true });
  const nombre = `${randomUUID()}.${ext}`;
  await writeFile(path.join(CARPETA, nombre), Buffer.from(await archivo.arrayBuffer()));
  return `/media/${nombre}`;
}

export async function borrarImagen(url: string) {
  const nombre = url.replace(/^\/media\//, "");
  if (!/^[\w-]+\.(jpg|png|webp|avif)$/.test(nombre)) return;
  await unlink(path.join(CARPETA, nombre)).catch(() => {});
}

export async function leerImagen(nombre: string) {
  if (!/^[\w-]+\.(jpg|png|webp|avif)$/.test(nombre)) return null;
  try {
    const datos = await readFile(path.join(CARPETA, nombre));
    const ext = nombre.split(".").pop()!;
    const tipo = Object.entries(TIPOS).find(([, e]) => e === ext)![0];
    return { datos, tipo };
  } catch {
    return null;
  }
}
