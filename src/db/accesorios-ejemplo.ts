// Accesorios de ejemplo. Textos provisionales: el dueño los reemplaza desde el admin.
// El seed los carga en una base vacía; cargar-fotos los inserta si todavía no existen.

import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { categorias, productos, productosComplementarios, variantes, type Publico } from "@/db/schema";

const CUIDADO = "Texto de ejemplo. El dueño va a escribir aquí cómo se cuida este accesorio.";

export const CATEGORIAS_ACCESORIO = [
  {
    nombre: "Cinturones",
    slug: "cinturones",
    orden: 10,
    descripcion: "Texto de ejemplo. Cinturones de piel para acompañar el par.",
  },
  {
    nombre: "Cuidado del calzado",
    slug: "cuidado-del-calzado",
    orden: 11,
    descripcion: "Texto de ejemplo. Hormas, calcetines y kits para que el par dure.",
  },
] as const;

type VarianteEjemplo = { color: string; hex: string; etiqueta: string | null; stock: number };

export const ACCESORIOS_EJEMPLO: {
  nombre: string;
  slug: string;
  codigo: string;
  categoria: string;
  publico: Publico;
  precio: number;
  material: string;
  materiales: string;
  descripcion: string;
  variantes: VarianteEjemplo[];
}[] = [
  {
    nombre: "Cinturón Herradura",
    slug: "cinturon-herradura",
    codigo: "CIN",
    categoria: "cinturones",
    publico: "hombre",
    precio: 89000,
    material: "Piel de becerro",
    materiales: "Texto de ejemplo. Tira de piel de becerro y hebilla de metal.",
    descripcion: "Texto de ejemplo. Cinturón de piel con hebilla sencilla. El dueño va a reemplazar esta ficha.",
    variantes: ["Café", "Negro"].flatMap((color) =>
      ["85 cm", "90 cm", "95 cm", "100 cm"].map((etiqueta) => ({
        color,
        hex: color === "Café" ? "#5d3f24" : "#1f1a17",
        etiqueta,
        stock: 8,
      })),
    ),
  },
  {
    nombre: "Calcetines Diario",
    slug: "calcetines-diario",
    codigo: "CAL",
    categoria: "cuidado-del-calzado",
    publico: "unisex",
    precio: 28000,
    material: "Algodón",
    materiales: "Texto de ejemplo. Algodón peinado. El dueño va a precisar la composición.",
    descripcion: "Texto de ejemplo. Calcetines de algodón, talla única. El dueño va a reemplazar esta ficha.",
    variantes: [{ color: "Gris", hex: "#8a847c", etiqueta: null, stock: 20 }],
  },
  {
    nombre: "Horma de cedro",
    slug: "horma-cedro",
    codigo: "HCE",
    categoria: "cuidado-del-calzado",
    publico: "unisex",
    precio: 45000,
    material: "Cedro",
    materiales: "Texto de ejemplo. Madera de cedro. El dueño va a precisar el origen.",
    descripcion: "Texto de ejemplo. Horma de cedro para guardar el par. El dueño va a reemplazar esta ficha.",
    variantes: [{ color: "Natural", hex: "#c4a574", etiqueta: null, stock: 12 }],
  },
  {
    nombre: "Kit de limpieza",
    slug: "kit-limpieza",
    codigo: "KIT",
    categoria: "cuidado-del-calzado",
    publico: "unisex",
    precio: 39000,
    material: "Cuidado",
    materiales: "Texto de ejemplo. Crema, cepillo y paño. El dueño va a listar el contenido real.",
    descripcion: "Texto de ejemplo. Kit para limpiar e hidratar la piel. El dueño va a reemplazar esta ficha.",
    variantes: [{ color: "Clásico", hex: "#aa9d92", etiqueta: null, stock: 15 }],
  },
];

/** Un zapato de ejemplo queda ligado a un accesorio, para ver «Combínalo con». */
export const COMPLEMENTOS_EJEMPLO = [
  { producto: "mocasin-alameda", complementario: "cinturon-herradura" },
  { producto: "bota-sierra", complementario: "kit-limpieza" },
] as const;

/** Inserta categorías, accesorios y ligas de ejemplo si todavía no están. No duplica. */
export async function asegurarAccesoriosEjemplo(db: Db) {
  for (const cat of CATEGORIAS_ACCESORIO) {
    const [existe] = await db.select({ id: categorias.id }).from(categorias).where(eq(categorias.slug, cat.slug));
    if (!existe) await db.insert(categorias).values({ ...cat, tipo: "accesorio" });
  }

  for (const item of ACCESORIOS_EJEMPLO) {
    const [existe] = await db.select({ id: productos.id }).from(productos).where(eq(productos.slug, item.slug));
    if (existe) continue;
    const [categoria] = await db.select({ id: categorias.id }).from(categorias).where(eq(categorias.slug, item.categoria));
    if (!categoria) continue;
    const [producto] = await db
      .insert(productos)
      .values({
        nombre: item.nombre,
        slug: item.slug,
        categoriaId: categoria.id,
        publico: item.publico,
        precio: item.precio,
        material: item.material,
        materiales: item.materiales,
        descripcion: item.descripcion,
        cuidado: CUIDADO,
        hechoEn: "Texto de ejemplo. Hecho en México.",
        estado: "activo",
      })
      .returning({ id: productos.id });

    await db.insert(variantes).values(
      item.variantes.map((v) => ({
        productoId: producto.id,
        color: v.color,
        colorHex: v.hex,
        talla: null,
        etiquetaTalla: v.etiqueta,
        sku: `DS-${item.codigo}-${v.color.slice(0, 3).toUpperCase()}-${(v.etiqueta ?? "U").replace(/\s/g, "")}`,
        stock: v.stock,
      })),
    );
  }

  for (const liga of COMPLEMENTOS_EJEMPLO) {
    const [producto] = await db.select({ id: productos.id }).from(productos).where(eq(productos.slug, liga.producto));
    const [complementario] = await db.select({ id: productos.id }).from(productos).where(eq(productos.slug, liga.complementario));
    if (!producto || !complementario) continue;
    await db
      .insert(productosComplementarios)
      .values({ productoId: producto.id, complementarioId: complementario.id, orden: 0 })
      .onConflictDoNothing();
  }
}
