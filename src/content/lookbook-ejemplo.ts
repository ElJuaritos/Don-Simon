import type { Publico } from "@/db/schema";

// Fotos de ejemplo del lookbook. El script npm run db:fotos les asigna la imagen.
// El dueño las reemplaza desde /admin/lookbook.

export type LookbookEjemplo = {
  orden: number;
  alt: string;
  publico: Publico;
  /** Nombre del archivo en .data/fotos-ejemplo, sin extensión */
  archivo: string;
  /** Slug del producto, si la foto debe llevar a un modelo */
  producto: string | null;
};

export const LOOKBOOK_EJEMPLO: LookbookEjemplo[] = [
  {
    orden: 1,
    alt: "Mocasines de piel café sobre piedra, con luz de tarde",
    publico: "hombre",
    archivo: "lookbook-01",
    producto: "mocasin-alameda",
  },
  {
    orden: 2,
    alt: "Botines coñac con luz de ventana",
    publico: "mujer",
    archivo: "lookbook-02",
    producto: "botin-jacaranda",
  },
  {
    orden: 3,
    alt: "Zapatos derby coñac sobre madera",
    publico: "hombre",
    archivo: "lookbook-03",
    producto: "derby-campo",
  },
  {
    orden: 4,
    alt: "Oxfords de piel café junto a la ventana",
    publico: "hombre",
    archivo: "lookbook-04",
    producto: "oxford-real",
  },
  {
    orden: 5,
    alt: "Mocasines coñac de mujer",
    publico: "mujer",
    archivo: "lookbook-05",
    producto: "mocasin-lucia",
  },
  {
    orden: 6,
    alt: "Botas de piel en el banco del taller",
    publico: "hombre",
    archivo: "lookbook-06",
    producto: "bota-sierra",
  },
  {
    orden: 7,
    alt: "Zapatos de piel café al caminar, con luz de tarde",
    publico: "unisex",
    archivo: "lookbook-07",
    producto: "chelsea-encino",
  },
  {
    orden: 8,
    alt: "Detalle de costura a mano en piel coñac",
    publico: "unisex",
    archivo: "lookbook-08",
    producto: null,
  },
];
