// Carga fotos de ejemplo (generadas con IA) en la base local para ver el diseño completo.
// Toma las imágenes de .data/fotos-ejemplo (también la carpeta lookbook/), las copia a
// .data/uploads y las asigna a portada, menús, historia, categorías, hormas, productos
// y lookbook. Se puede correr varias veces: reemplaza las fotos de ejemplo anteriores.
// Uso (con el servidor detenido, PGlite no admite dos procesos): npm run db:fotos
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { and, eq, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { LOOKBOOK_EJEMPLO } from "../src/content/lookbook-ejemplo";
import * as schema from "../src/db/schema";
import { seed } from "../src/db/seed";

const { bloques, categorias, hormas, imagenes, lookbookFotos, productos } = schema;

const ORIGEN = path.join(process.cwd(), ".data", "fotos-ejemplo");
const DESTINO = path.join(process.cwd(), ".data", "uploads");

const BLOQUES = [
  "portada-hombre",
  "portada-mujer",
  "portada-oficio",
  "portada-col-hombre-1",
  "portada-col-hombre-2",
  "portada-col-hombre-3",
  "portada-col-mujer-1",
  "portada-col-mujer-2",
  "portada-col-mujer-3",
  "menu-hombre-1",
  "menu-hombre-2",
  "menu-hombre-3",
  "menu-mujer-1",
  "menu-mujer-2",
  "menu-mujer-3",
  "menu-nosotros-1",
  "menu-nosotros-2",
  "menu-nosotros-3",
  "historia-intro",
  "historia-quien",
  "historia-galeria-1",
  "historia-galeria-2",
  "historia-galeria-3",
  "hombre-hero-1",
  "hombre-hero-2",
  "mujer-hero-1",
  "mujer-hero-2",
];

/** Si no hay un archivo con el nombre del cuadro, se reutiliza otra foto de ejemplo. */
const ALIAS: Record<string, string> = {
  "portada-col-hombre-1": "lookbook-07",
  "portada-col-hombre-2": "lookbook-03",
  "portada-col-hombre-3": "lookbook-06",
  "portada-col-mujer-1": "lookbook-02",
  "portada-col-mujer-2": "lookbook-05",
  "portada-col-mujer-3": "lookbook-08",
  "menu-hombre-1": "lookbook-01",
  "menu-hombre-2": "lookbook-03",
  "menu-hombre-3": "lookbook-06",
  "menu-mujer-1": "lookbook-02",
  "menu-mujer-2": "lookbook-05",
  "menu-mujer-3": "portada-mujer",
  "menu-nosotros-1": "historia-intro",
  "menu-nosotros-2": "portada-oficio",
  "menu-nosotros-3": "portada-hormas",
  "hombre-hero-1": "lookbook-01",
  "hombre-hero-2": "lookbook-07",
  "mujer-hero-1": "lookbook-05",
  "mujer-hero-2": "lookbook-02",
  "categoria-mocasines-hombre": "lookbook-01",
  "categoria-mocasines-mujer": "lookbook-05",
  "categoria-botas-hombre": "lookbook-06",
  "categoria-botas-mujer": "lookbook-08",
  "categoria-oxford-hombre": "lookbook-04",
  "categoria-oxford-mujer": "lookbook-03",
};

const CATEGORIAS_PUBLICO: Record<string, { hombre: string; mujer: string }> = {
  mocasines: { hombre: "categoria-mocasines-hombre", mujer: "categoria-mocasines-mujer" },
  botas: { hombre: "categoria-botas-hombre", mujer: "categoria-botas-mujer" },
  "oxford-y-derby": { hombre: "categoria-oxford-hombre", mujer: "categoria-oxford-mujer" },
};
const CATEGORIAS: Record<string, string> = {
  mocasines: "categoria-mocasines",
  botas: "categoria-botas",
  "oxford-y-derby": "categoria-oxford",
};
const HORMAS: Record<string, string> = {
  "Horma Clásica": "horma-clasica",
  "Horma Amplia": "horma-amplia",
};
/** Segunda foto de ejemplo, mismo color, para el cambio al pasar el cursor. */
const SEGUNDA_FOTO: Record<string, string> = {
  "mocasin-alameda": "lookbook-03",
  "mocasin-olivar": "lookbook-04",
  "bota-sierra": "lookbook-06",
  "chelsea-encino": "lookbook-08",
  "oxford-real": "lookbook-04",
  "derby-campo": "lookbook-07",
  "mocasin-lucia": "lookbook-05",
  "botin-jacaranda": "lookbook-02",
};
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
      "Crea .data/fotos-ejemplo y pon ahí los archivos (portada-hombre.png, lookbook/lookbook-01.jpg, etc.) antes de correr este comando.",
  );
  process.exit(1);
}

async function indexar(dir: string, mapa: Map<string, string>) {
  const entradas = await readdir(dir, { withFileTypes: true });
  for (const e of entradas) {
    const ruta = path.join(dir, e.name);
    if (e.isDirectory()) {
      await indexar(ruta, mapa);
      continue;
    }
    const match = e.name.match(/^(.+)\.(png|jpe?g|webp)$/i);
    if (match) mapa.set(match[1], ruta);
  }
}

const archivos = new Map<string, string>();
await indexar(ORIGEN, archivos);
await mkdir(DESTINO, { recursive: true });
const subidas = await readdir(DESTINO);

/**
 * Copia la foto a uploads y devuelve su URL pública, o null si no existe.
 * El nombre lleva un hash del contenido: si la foto cambia, cambia la URL.
 */
async function publicar(nombre: string) {
  const fuente = archivos.get(ALIAS[nombre] ?? nombre);
  if (!fuente) {
    console.warn(`  Falta ${nombre}`);
    return null;
  }
  const datos = await readFile(fuente);
  const hash = createHash("sha1").update(datos).digest("hex").slice(0, 8);
  const ext = path.extname(fuente).slice(1).toLowerCase().replace("jpeg", "jpg");
  const archivo = `ejemplo-${nombre}-${hash}.${ext}`;
  for (const viejo of subidas) {
    if (viejo !== archivo && new RegExp(`^ejemplo-${nombre}(-[0-9a-f]{8})?\\.(png|jpe?g|webp)$`, "i").test(viejo)) {
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
console.log("✓ Portada, menús y Nuestra historia");

for (const [slug, archivo] of Object.entries(CATEGORIAS)) {
  const url = await publicar(archivo);
  const publico = CATEGORIAS_PUBLICO[slug];
  const hombre = publico ? await publicar(publico.hombre) : null;
  const mujer = publico ? await publicar(publico.mujer) : null;
  if (url || hombre || mujer) {
    await db
      .update(categorias)
      .set({
        ...(url ? { imagenUrl: url } : {}),
        ...(hombre ? { imagenHombreUrl: hombre } : {}),
        ...(mujer ? { imagenMujerUrl: mujer } : {}),
      })
      .where(eq(categorias.slug, slug));
  }
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
  await db.insert(imagenes).values({
    productoId: producto.id,
    color,
    url,
    alt: `${producto.nombre} en ${color.toLowerCase()}`,
    orden: 0,
  });
  const nombreSegunda = SEGUNDA_FOTO[slug];
  const segunda = nombreSegunda ? await publicar(nombreSegunda) : null;
  if (segunda) {
    await db.insert(imagenes).values({
      productoId: producto.id,
      color,
      url: segunda,
      alt: `${producto.nombre} en ${color.toLowerCase()}, otro ángulo`,
      orden: 1,
    });
  }
}
console.log("✓ Productos");

const actuales = await db.select().from(lookbookFotos);
const delDueno = actuales.some((f) => f.imagenUrl && !f.imagenUrl.includes("/media/ejemplo-"));
if (delDueno) {
  console.log("✓ Lookbook ya tiene fotos propias: no las reemplazo");
} else {
  if (actuales.length > 0) await db.delete(lookbookFotos);
  const filas = [];
  for (const item of LOOKBOOK_EJEMPLO) {
    const url = await publicar(item.archivo);
    const [producto] = item.producto
      ? await db.select({ id: productos.id }).from(productos).where(eq(productos.slug, item.producto))
      : [undefined];
    filas.push({
      alt: item.alt,
      publico: item.publico,
      orden: item.orden,
      activa: true,
      imagenUrl: url,
      productoId: producto?.id ?? null,
    });
  }
  if (filas.length > 0) await db.insert(lookbookFotos).values(filas);
  console.log("✓ Lookbook");
}

await client.close();
