// Carga fotos de ejemplo (generadas con IA) en la base local para ver el diseño completo.
// Toma las imágenes de .data/fotos-ejemplo, las copia a .data/uploads y las asigna
// a los cuadros de portada/historia, categorías, hormas y productos. Se puede correr
// varias veces: reemplaza las fotos de ejemplo anteriores.
// Uso (con el servidor detenido, PGlite no admite dos procesos): npm run db:fotos
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { and, eq, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../src/db/schema";
import { seed } from "../src/db/seed";

const { bloques, categorias, hormas, imagenes, productos } = schema;

const ORIGEN = path.join(process.cwd(), ".data", "fotos-ejemplo");
const DESTINO = path.join(process.cwd(), ".data", "uploads");

const BLOQUES = [
  "portada-hero", "portada-hombre", "portada-mujer", "portada-oficio", "portada-hormas",
  "portada-galeria-1", "portada-galeria-2", "portada-galeria-3",
  "historia-intro", "historia-quien", "historia-galeria-1", "historia-galeria-2", "historia-galeria-3",
];
const CATEGORIAS: Record<string, string> = {
  mocasines: "categoria-mocasines",
  botas: "categoria-botas",
  "oxford-y-derby": "categoria-oxford",
};
const HORMAS: Record<string, string> = {
  "Horma Clásica": "horma-clasica",
  "Horma Amplia": "horma-amplia",
};
/** slug del producto → [archivo, color que muestra la foto] */
const PRODUCTOS: Record<string, [string, string]> = {
  "mocasin-alameda": ["producto-alameda", "Café"],
  "mocasin-olivar": ["producto-olivar", "Negro"],
  "bota-sierra": ["producto-sierra", "Café"],
  "chelsea-encino": ["producto-encino", "Negro"],
  "oxford-real": ["producto-real", "Negro"],
  "derby-campo": ["producto-campo", "Coñac"],
  "mocasin-lucia": ["producto-lucia", "Coñac"],
  "botin-jacaranda": ["producto-jacaranda", "Café"],
};

if (!existsSync(ORIGEN)) {
  console.error(
    `No encontré la carpeta de fotos de ejemplo (${ORIGEN}).\n` +
      "Crea .data/fotos-ejemplo y pon ahí los PNG (portada-hero.png, producto-alameda.png, etc.) antes de correr este comando.",
  );
  process.exit(1);
}

const disponibles = new Set((await readdir(ORIGEN)).map((f) => f.replace(/\.png$/, "")));
await mkdir(DESTINO, { recursive: true });

const subidas = await readdir(DESTINO);

/**
 * Copia la foto a uploads y devuelve su URL pública, o null si no existe.
 * El nombre lleva un hash del contenido: si la foto cambia, cambia la URL y
 * ni el optimizador de Next ni el navegador sirven la versión en caché.
 */
async function publicar(nombre: string) {
  if (!disponibles.has(nombre)) {
    console.warn(`  Falta ${nombre}.png`);
    return null;
  }
  const datos = await readFile(path.join(ORIGEN, `${nombre}.png`));
  const hash = createHash("sha1").update(datos).digest("hex").slice(0, 8);
  const archivo = `ejemplo-${nombre}-${hash}.png`;
  for (const viejo of subidas) {
    if (viejo !== archivo && new RegExp(`^ejemplo-${nombre}(-[0-9a-f]{8})?\\.png$`).test(viejo)) {
      await unlink(path.join(DESTINO, viejo)).catch(() => {});
    }
  }
  await writeFile(path.join(DESTINO, archivo), datos);
  return `/media/${archivo}`;
}

const client = new PGlite(path.join(process.cwd(), ".data", "pglite"));
const db = drizzle(client, { schema });
await migrate(db, { migrationsFolder: "drizzle" });
await seed(db);

for (const clave of BLOQUES) {
  const url = await publicar(clave);
  if (!url) continue;
  await db
    .insert(bloques)
    .values({ clave, imagenUrl: url })
    .onConflictDoUpdate({ target: bloques.clave, set: { imagenUrl: url } });
}
console.log("✓ Portada y Nuestra historia");

for (const [slug, archivo] of Object.entries(CATEGORIAS)) {
  const url = await publicar(archivo);
  if (url) await db.update(categorias).set({ imagenUrl: url }).where(eq(categorias.slug, slug));
}
console.log("✓ Categorías");

for (const [nombre, archivo] of Object.entries(HORMAS)) {
  const url = await publicar(archivo);
  if (url) await db.update(hormas).set({ imagenUrl: url }).where(eq(hormas.nombre, nombre));
}
console.log("✓ Hormas");

for (const [slug, [archivo, color]] of Object.entries(PRODUCTOS)) {
  const url = await publicar(archivo);
  const [producto] = await db.select().from(productos).where(eq(productos.slug, slug));
  if (!url || !producto) continue;
  await db
    .delete(imagenes)
    .where(and(eq(imagenes.productoId, producto.id), like(imagenes.url, "/media/ejemplo-%")));
  await db.insert(imagenes).values({ productoId: producto.id, color, url, alt: `${producto.nombre} en ${color.toLowerCase()}`, orden: 0 });
}
console.log("✓ Productos");

await client.close();
