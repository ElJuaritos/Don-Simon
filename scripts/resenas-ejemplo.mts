import { existsSync, readFileSync } from "node:fs";
import { eq, like } from "drizzle-orm";
import { getDb } from "../src/db/index";
import { productos, resenas } from "../src/db/schema";

// Reseñas inventadas para ver el diseño en local. No van en el seed.
// Nunca llevan compra verificada. Se niega a correr si hay DATABASE_URL.
// Uso (servidor detenido): npm run db:resenas-ejemplo
// Quitarlas: npm run db:resenas-ejemplo -- --borrar

const MARCA = "(ejemplo)";

function urlDeBase() {
  if (process.env.DATABASE_URL?.trim()) return true;
  if (!existsSync(".env.local")) return false;
  for (const linea of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = linea.match(/^\s*DATABASE_URL\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    const valor = m[1].replace(/^["']|["']$/g, "").trim();
    if (valor) return true;
  }
  return false;
}

if (urlDeBase()) {
  console.error("Este script solo corre en la base local. DATABASE_URL tiene valor, así que no se cargó nada.");
  process.exit(1);
}

const TEXTOS: { titulo: string; texto: string; calificacion: number; ajuste: number; ancho: "angosto" | "normal" | "ancho"; nombre: string; ciudad: string }[] = [
  { titulo: "Cómodos desde el primer día", texto: "Los usé toda la tarde y no me lastimaron. La piel se siente suave y el color es el de la foto.", calificacion: 5, ajuste: 0, ancho: "normal", nombre: "Ana L.", ciudad: "Guadalajara" },
  { titulo: "Quedaron justos de largo", texto: "El ancho está bien, pero el largo me quedó un poco corto. Pediría media talla más la próxima vez.", calificacion: 4, ajuste: -1, ancho: "normal", nombre: "Luis M.", ciudad: "Puebla" },
  { titulo: "Justo lo que buscaba", texto: "Se ven cuidados y el acabado de la suela es parejo. Ya los saqué a caminar y no se marcaron.", calificacion: 5, ajuste: 0, ancho: "ancho", nombre: "María G.", ciudad: "Monterrey" },
  { titulo: "Un poco holgados", texto: "Me gustan, aunque en el empeine me quedaron un poco grandes. Con calcetín delgado se sienten mejor.", calificacion: 4, ajuste: 1, ancho: "angosto", nombre: "Diego R.", ciudad: "Querétaro" },
  { titulo: "Buenos, con un detalle", texto: "La horma me queda fiel a la talla. El único detalle es que tardé un par de días en amoldarlos.", calificacion: 4, ajuste: 0, ancho: "normal", nombre: "Sofía P.", ciudad: "Ciudad de México" },
  { titulo: "Me encantaron", texto: "Livianos y con buena presencia. Los usé en una comida y recibí varios comentarios. Volvería a comprar.", calificacion: 5, ajuste: 0, ancho: "normal", nombre: "Jorge H.", ciudad: "León" },
  { titulo: "Quedan grandes", texto: "Pedí mi talla de siempre y me quedaron largos. El cuero es bonito, pero tuve que usar plantilla.", calificacion: 3, ajuste: 2, ancho: "normal", nombre: "Elena V.", ciudad: "Mérida" },
  { titulo: "Fieles a la talla", texto: "Medí mi pie y coincidió con la guía. El ancho normal me queda bien, sin apretar ni bailar.", calificacion: 5, ajuste: 0, ancho: "normal", nombre: "Ricardo S.", ciudad: "Toluca" },
  { titulo: "Para pie angosto, bien", texto: "Suelo batallar con zapatos que me quedan flojos de los lados. Estos se sienten firmes sin doler.", calificacion: 5, ajuste: 0, ancho: "angosto", nombre: "Paula C.", ciudad: "Oaxaca" },
  { titulo: "Correctos", texto: "Ni chicos ni grandes. El color coñac se ve más cálido en persona, y me gustó más así.", calificacion: 4, ajuste: 0, ancho: "ancho", nombre: "Héctor N.", ciudad: "Morelia" },
  { titulo: "Un pelín chicos", texto: "Al principio me apretaban la punta. Después de una semana cedieron y ya los uso diario.", calificacion: 4, ajuste: -1, ancho: "ancho", nombre: "Camila F.", ciudad: "Cancún" },
  { titulo: "Muy bien hechos", texto: "Se nota el trabajo a mano en la costura. Caminé bastante y la plantilla sigue cómoda.", calificacion: 5, ajuste: 0, ancho: "normal", nombre: "Andrés T.", ciudad: "Saltillo" },
  { titulo: "Esperaba más del ajuste", texto: "El zapato está bien armado, pero a mí me quedó corto. La guía de tallas sí ayuda a no equivocarse.", calificacion: 3, ajuste: -2, ancho: "normal", nombre: "Valeria D.", ciudad: "Tijuana" },
  { titulo: "Los recomiendo", texto: "Ligeros, con buena horma y fáciles de combinar. Llegaron bien empacados y en el tiempo que dijeron.", calificacion: 5, ajuste: 1, ancho: "normal", nombre: "Omar B.", ciudad: "Aguascalientes" },
];

const db = await getDb();

if (process.argv.includes("--borrar")) {
  const borradas = await db.delete(resenas).where(like(resenas.nombre, `%${MARCA}%`)).returning({ id: resenas.id });
  console.log(`Se quitaron ${borradas.length} reseñas de ejemplo.`);
  process.exit(0);
}

const modelos = await db.select({ id: productos.id }).from(productos).where(eq(productos.estado, "activo"));
if (modelos.length === 0) {
  console.error("No hay productos activos en la base local.");
  process.exit(1);
}

await db.delete(resenas).where(like(resenas.nombre, `%${MARCA}%`));
await db.insert(resenas).values(
  TEXTOS.map((t, i) => ({
    productoId: (i < 6 ? modelos[0] : modelos[i % modelos.length]).id,
    nombre: `${t.nombre} ${MARCA}`,
    ciudad: t.ciudad,
    calificacion: t.calificacion,
    titulo: t.titulo,
    texto: t.texto,
    ajuste: t.ajuste,
    anchoPie: t.ancho,
    estado: "publicada" as const,
    verificada: false,
    createdAt: new Date(Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000),
  })),
);

console.log(`${TEXTOS.length} reseñas de ejemplo publicadas en la base local. Llevan «${MARCA}» en el nombre.`);
process.exit(0);
