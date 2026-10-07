import { marca } from "@/config/marca";

// Enlaces compartidos por el header, el menú móvil y el footer.
// Pieles y notas solo se muestran cuando ya hay contenido. «Dónde encontrarnos» sigue fuera (D17).

export type Enlace = { href: string; texto: string; imagen?: { url: string; alt: string } | null };
export type ColumnaNav = { titulo: string; enlaces: Enlace[] };
export type FotoNav = {
  href: string;
  titulo: string;
  imagen: { url: string; alt: string } | null;
  nota?: string;
};

export type EntradaNav =
  | { tipo: "enlace"; id: string; href: string; texto: string }
  | { tipo: "menu"; id: string; href: string; texto: string; columnas: ColumnaNav[]; fotos: FotoNav[] };

export const AYUDA: Enlace[] = [
  { href: "/ayuda/guia-de-tallas", texto: "Guía de tallas" },
  { href: "/ayuda/envios", texto: "Envíos" },
  { href: "/rastrear", texto: "Rastrear pedido" },
  { href: "/ayuda/cambios-y-devoluciones", texto: "Cambios y devoluciones" },
  { href: "/ayuda/preguntas-frecuentes", texto: "Preguntas frecuentes" },
  { href: "/contacto", texto: "Contacto" },
];

type CategoriaNav = {
  slug: string;
  nombre: string;
  imagen?: { url: string; alt: string } | null;
};

/**
 * Columnas del mega menú de Hombre o Mujer.
 * «Ocasión» abre el catálogo con el filtro aplicado.
 * Cinturones, calcetines y piel pequeña esperan a que se definan los accesorios.
 */
export function columnasPublico(para: "hombre" | "mujer", categorias: CategoriaNav[]): ColumnaNav[] {
  return [
    {
      titulo: "Calzado",
      enlaces: [
        ...categorias.map((c) => ({
          href: `/coleccion/${c.slug}?para=${para}`,
          texto: c.nombre,
          imagen: c.imagen,
        })),
        { href: `/coleccion?para=${para}`, texto: "Ver todo" },
      ],
    },
    {
      titulo: "Accesorios",
      enlaces: [{ href: "/ayuda/cuidado-del-calzado", texto: "Cuidado del calzado" }],
    },
    {
      titulo: "Ocasión",
      enlaces: [
        { href: `/coleccion?para=${para}&ocasion=formal`, texto: "Formal" },
        { href: `/coleccion?para=${para}&ocasion=casual`, texto: "Casual" },
        { href: `/coleccion?para=${para}&ocasion=boda`, texto: "Boda" },
      ],
    },
  ];
}

export function columnasNosotros({
  resenas = false,
  pieles = false,
  notas = false,
}: {
  resenas?: boolean;
  pieles?: boolean;
  notas?: boolean;
} = {}): ColumnaNav[] {
  return [
    {
      titulo: "Nosotros",
      enlaces: [
        { href: "/nuestra-historia", texto: "Nuestra historia" },
        { href: "/el-oficio", texto: "El oficio" },
        { href: "/nuestras-hormas", texto: "Nuestras hormas" },
        ...(pieles ? [{ href: "/pieles", texto: "Pieles" }] : []),
      ],
    },
    {
      titulo: marca.nombre,
      enlaces: [
        { href: "/lookbook", texto: "Lookbook" },
        ...(notas ? [{ href: "/notas", texto: "Notas" }] : []),
        ...(resenas ? [{ href: "/resenas", texto: "Reseñas" }] : []),
      ],
    },
    {
      titulo: "Ayuda",
      enlaces: [
        { href: "/ayuda/preguntas-frecuentes", texto: "Preguntas frecuentes" },
        { href: "/ayuda/guia-de-tallas", texto: "Guía de tallas" },
        { href: "/rastrear", texto: "Rastrear pedido" },
        { href: "/ayuda/cambios-y-devoluciones", texto: "Cambios y devoluciones" },
        { href: "/contacto", texto: "Contacto" },
      ],
    },
  ];
}

export function columnasFooter({
  resenas = false,
  pieles = false,
  notas = false,
}: {
  resenas?: boolean;
  pieles?: boolean;
  notas?: boolean;
} = {}): ColumnaNav[] {
  return [
    {
      titulo: "Tienda",
      enlaces: [
        { href: "/hombre", texto: "Hombre" },
        { href: "/mujer", texto: "Mujer" },
        { href: "/lookbook", texto: "Lookbook" },
        { href: "/ayuda/cuidado-del-calzado", texto: "Cuidado del calzado" },
      ],
    },
    { titulo: "Ayuda", enlaces: AYUDA },
    {
      titulo: marca.nombre,
      enlaces: [
        { href: "/nuestra-historia", texto: "Nuestra historia" },
        { href: "/el-oficio", texto: "El oficio" },
        { href: "/nuestras-hormas", texto: "Nuestras hormas" },
        ...(pieles ? [{ href: "/pieles", texto: "Pieles" }] : []),
        { href: "/lookbook", texto: "Lookbook" },
        ...(notas ? [{ href: "/notas", texto: "Notas" }] : []),
        ...(resenas ? [{ href: "/resenas", texto: "Reseñas" }] : []),
      ],
    },
    {
      titulo: "Mi cuenta",
      enlaces: [
        { href: "/cuenta", texto: "Iniciar sesión" },
        { href: "/cuenta", texto: "Crear cuenta" },
      ],
    },
  ];
}
