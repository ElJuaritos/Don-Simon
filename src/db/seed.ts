import { count } from "drizzle-orm";
import type { Db } from "./index";
import { categorias, hormas, productos, variantes, type Publico } from "./schema";

// Datos de ejemplo para desarrollo. Solo se cargan si la base está vacía.
// Son modelos inventados: se reemplazan por el catálogo real desde el admin.

const TALLAS = [25, 25.5, 26, 26.5, 27, 27.5, 28, 28.5, 29];

const COLORES = {
  cafe: { nombre: "Café", hex: "#5d3f24" },
  conac: { nombre: "Coñac", hex: "#8a4b2a" },
  negro: { nombre: "Negro", hex: "#1f1a17" },
  olivo: { nombre: "Olivo", hex: "#6b6547" },
} as const;

type ColorKey = keyof typeof COLORES;

const MATERIALES = "Piel de becerro curtida al vegetal. Forro de piel de cabra.";
const CUIDADO =
  "Limpia con un paño suave y seco. Hidrata la piel cada 2–3 meses con crema neutra. Guárdalos con hormas de madera y lejos del sol directo.";

const MODELOS: {
  nombre: string;
  slug: string;
  codigo: string;
  categoria: string;
  publico: Publico;
  precio: number;
  precioComparacion?: number;
  colores: ColorKey[];
  destacado: boolean;
  construccion: string;
  suela: string;
  descripcion: string;
}[] = [
  {
    nombre: "Mocasín Alameda",
    slug: "mocasin-alameda",
    codigo: "ALA",
    categoria: "mocasines",
    publico: "hombre",
    precio: 349000,
    colores: ["cafe", "conac"],
    destacado: true,
    construccion: "Cosido Blake",
    suela: "Suela de cuero con tapa de goma",
    descripcion:
      "El mocasín que da origen a la casa. Un corte limpio, sin adornos, que se amolda al pie con cada uso. Pensado para el día a día y para las ocasiones que piden algo más.",
  },
  {
    nombre: "Mocasín Olivar",
    slug: "mocasin-olivar",
    codigo: "OLI",
    categoria: "mocasines",
    publico: "unisex",
    precio: 329000,
    precioComparacion: 369000,
    colores: ["negro", "olivo"],
    destacado: false,
    construccion: "Cosido Blake",
    suela: "Suela de cuero",
    descripcion:
      "Antifaz cosido a mano y puntera redondeada. Ligero, flexible y cómodo desde el primer día.",
  },
  {
    nombre: "Bota Sierra",
    slug: "bota-sierra",
    codigo: "SIE",
    categoria: "botas",
    publico: "hombre",
    precio: 429000,
    colores: ["cafe", "conac"],
    destacado: true,
    construccion: "Cosido Goodyear",
    suela: "Suela de goma con relieve",
    descripcion:
      "Bota de agujeta con construcción Goodyear: se puede volver a suelar muchas veces. Hecha para durar años y verse mejor con cada uno.",
  },
  {
    nombre: "Chelsea Encino",
    slug: "chelsea-encino",
    codigo: "ENC",
    categoria: "botas",
    publico: "unisex",
    precio: 399000,
    colores: ["negro", "cafe"],
    destacado: true,
    construccion: "Cosido Blake",
    suela: "Suela de cuero con tapa de goma",
    descripcion:
      "Elásticos laterales y tirador trasero para ponértela en un segundo. Silueta estilizada que va igual con jeans que con traje.",
  },
  {
    nombre: "Oxford Real",
    slug: "oxford-real",
    codigo: "REA",
    categoria: "oxford-y-derby",
    publico: "hombre",
    precio: 369000,
    colores: ["negro", "cafe"],
    destacado: false,
    construccion: "Cosido Goodyear",
    suela: "Suela de cuero",
    descripcion:
      "El clásico de vestir, con el cierre cerrado característico del Oxford. Piel de acabado pulido que toma brillo con el cuidado.",
  },
  {
    nombre: "Derby Campo",
    slug: "derby-campo",
    codigo: "CAM",
    categoria: "oxford-y-derby",
    publico: "hombre",
    precio: 339000,
    colores: ["conac", "olivo"],
    destacado: true,
    construccion: "Cosido Blake",
    suela: "Suela de goma ligera",
    descripcion:
      "Derby de cierre abierto, más relajado que un Oxford. El zapato para quien quiere verse bien sin esfuerzo.",
  },
  {
    nombre: "Mocasín Lucía",
    slug: "mocasin-lucia",
    codigo: "LUC",
    categoria: "mocasines",
    publico: "mujer",
    precio: 319000,
    colores: ["conac", "negro"],
    destacado: true,
    construccion: "Cosido Blake",
    suela: "Suela de cuero con tapa de goma",
    descripcion:
      "Mocasín de silueta afinada y puntera almendrada. Suave desde el primer día y hecho para caminar la ciudad.",
  },
  {
    nombre: "Botín Jacaranda",
    slug: "botin-jacaranda",
    codigo: "JAC",
    categoria: "botas",
    publico: "mujer",
    precio: 389000,
    colores: ["cafe", "negro"],
    destacado: false,
    construccion: "Cosido Blake",
    suela: "Suela de cuero con tacón de 4 cm",
    descripcion:
      "Botín al tobillo con cierre lateral y tacón bajo de madera forrada en piel. Va de la oficina a la cena.",
  },
];

// Tallas de dama: se generan con otro rango que las de caballero
const TALLAS_MUJER = [22, 22.5, 23, 23.5, 24, 24.5, 25, 25.5, 26];

export async function seed(db: Db) {
  const [{ total }] = await db.select({ total: count() }).from(categorias);
  if (total > 0) return;

  const cats = await db
    .insert(categorias)
    .values([
      {
        nombre: "Mocasines",
        slug: "mocasines",
        orden: 1,
        descripcion: "Sin agujetas, sin prisas. Mocasines de piel cosidos a mano.",
      },
      {
        nombre: "Botas",
        slug: "botas",
        orden: 2,
        descripcion: "Botas de piel hechas para durar y verse mejor con los años.",
      },
      {
        nombre: "Oxford y Derby",
        slug: "oxford-y-derby",
        orden: 3,
        descripcion: "Zapatos de agujeta para vestir o para todos los días.",
      },
    ])
    .returning();

  const [clasica, amplia] = await db
    .insert(hormas)
    .values([
      {
        nombre: "Horma Clásica",
        recomendacion: "Pide tu talla de siempre.",
        orden: 1,
        descripcion:
          "Nuestra horma de base. Puntera redondeada, empeine medio y un talón firme que sujeta sin apretar. Es la que usan los mocasines y los zapatos de vestir.",
      },
      {
        nombre: "Horma Amplia",
        recomendacion: "Calza un poco grande: si estás entre dos tallas, pide la menor.",
        ancho: "ancho",
        orden: 2,
        descripcion:
          "Más volumen en el empeine y en la punta para dejar espacio a un calcetín grueso. Pensada para botas y para pies anchos.",
      },
    ])
    .returning();

  for (const [i, m] of MODELOS.entries()) {
    const categoria = cats.find((c) => c.slug === m.categoria)!;
    const [producto] = await db
      .insert(productos)
      .values({
        nombre: m.nombre,
        slug: m.slug,
        categoriaId: categoria.id,
        hormaId: m.categoria === "botas" ? amplia.id : clasica.id,
        publico: m.publico,
        descripcion: m.descripcion,
        precio: m.precio,
        precioComparacion: m.precioComparacion ?? null,
        materiales: MATERIALES,
        construccion: m.construccion,
        suela: m.suela,
        cuidado: CUIDADO,
        hechoEn: "Hecho a mano en México",
        destacado: m.destacado,
        estado: "activo",
      })
      .returning();

    await db.insert(variantes).values(
      m.colores.flatMap((key) =>
        (m.publico === "mujer" ? TALLAS_MUJER : TALLAS).map((talla, j) => {
          const color = COLORES[key];
          const colorCode = color.nombre.slice(0, 3).toUpperCase().replace("Ñ", "N");
          return {
            productoId: producto.id,
            color: color.nombre,
            colorHex: color.hex,
            talla,
            sku: `DS-${m.codigo}-${colorCode}-${String(talla * 10)}`,
            // Stock variado para ver tallas agotadas y "últimos pares"
            stock: (i + j) % 5 === 0 ? 0 : ((i * 3 + j * 7) % 6) + 1,
          };
        }),
      ),
    );
  }
}
