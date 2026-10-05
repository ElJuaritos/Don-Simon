// Sube a Supabase Storage las fotos que la base todavía tiene en /media/... (disco local)
// y cambia sus URL por la pública del bucket "media". Se puede correr varias veces.
// Necesita DATABASE_URL, SUPABASE_URL y SUPABASE_SECRET_KEY en .env.local.
// Uso: npm run db:subir-fotos
import { readFile } from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

const { DATABASE_URL, SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
if (!DATABASE_URL || !SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error("Faltan DATABASE_URL, SUPABASE_URL o SUPABASE_SECRET_KEY en .env.local");
  process.exit(1);
}

const base = SUPABASE_URL.replace(/\/$/, "");
const publica = `${base}/storage/v1/object/public/media/`;
const headers = { apikey: SUPABASE_SECRET_KEY, Authorization: `Bearer ${SUPABASE_SECRET_KEY}` };
const TIPOS: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };

const COLUMNAS = [
  ["imagenes", "url"],
  ["bloques", "imagen_url"],
  ["categorias", "imagen_url"],
  ["hormas", "imagen_url"],
] as const;

const sql = postgres(DATABASE_URL, { max: 1, prepare: false });

const archivos = new Set<string>();
for (const [tabla, col] of COLUMNAS) {
  const filas = await sql`select ${sql(col)} as url from ${sql(tabla)} where ${sql(col)} like '/media/%'`;
  for (const f of filas) archivos.add(String(f.url).slice("/media/".length));
}
console.log(`${archivos.size} fotos por subir`);

for (const nombre of archivos) {
  const tipo = TIPOS[nombre.split(".").pop() ?? ""];
  if (!/^[\w-]+\.(jpg|png|webp|avif)$/.test(nombre) || !tipo) {
    console.warn(`  · omitida (nombre no válido): ${nombre}`);
    continue;
  }
  const datos = await readFile(path.join(process.cwd(), ".data", "uploads", nombre)).catch(() => null);
  if (!datos) {
    console.warn(`  · omitida (no está en .data/uploads): ${nombre}`);
    continue;
  }
  const res = await fetch(`${base}/storage/v1/object/media/${nombre}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": tipo, "Cache-Control": "max-age=31536000", "x-upsert": "true" },
    body: datos,
  });
  if (!res.ok) {
    console.error(`  ✗ ${nombre}: ${res.status} ${await res.text()}`);
    continue;
  }
  for (const [tabla, col] of COLUMNAS) {
    await sql`update ${sql(tabla)} set ${sql(col)} = ${publica + nombre} where ${sql(col)} = ${"/media/" + nombre}`;
  }
  console.log(`  ✓ ${nombre}`);
}

await sql.end();
