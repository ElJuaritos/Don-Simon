import { marca, tienda } from "@/config/marca";

// Cuadros editables (foto + textos) de la portada, los menús y Nuestra historia.
// Aquí se define qué cuadros existen, qué campos tiene cada uno y su texto por defecto.
// Lo que el dueño cambia desde /admin/contenido se guarda en la tabla `bloques`
// y tiene prioridad sobre estos valores.

export type CampoBloque = "titulo" | "texto" | "enlace" | "imagen";
export type GrupoBloque = "portada" | "historia" | "global" | "menus" | "lookbook";

export type DefinicionBloque = {
  clave: string;
  grupo: GrupoBloque;
  /** Nombre que ve el dueño en el admin */
  nombre: string;
  /** Dónde aparece, en lenguaje claro */
  ayuda: string;
  campos: CampoBloque[];
  /** Recomendación para la foto */
  proporcion?: string;
  /** Qué foto va aquí mientras no se sube una */
  notaFoto?: string;
  /** Ayuda del campo de texto, si hace falta algo distinto a la genérica */
  ayudaTexto?: string;
  defecto: {
    titulo?: string;
    texto?: string;
    enlaceTexto?: string;
    enlaceUrl?: string;
    imagenAlt?: string;
  };
};

export const GRUPOS: Record<GrupoBloque, { nombre: string; ruta: string }> = {
  portada: { nombre: "Portada", ruta: "/" },
  historia: { nombre: "Nuestra historia", ruta: "/nuestra-historia" },
  global: { nombre: "Aviso de arriba", ruta: "/" },
  menus: { nombre: "Fotos de los menús", ruta: "/" },
  lookbook: { nombre: "Lookbook", ruta: "/lookbook" },
};

/** Grupos que se editan en /admin/contenido. El lookbook tiene su propia pantalla. */
export const GRUPOS_CONTENIDO = (Object.keys(GRUPOS) as GrupoBloque[]).filter((g) => g !== "lookbook");

const galeria = (n: number, notaFoto: string, grupo: GrupoBloque): DefinicionBloque => ({
  clave: `${grupo}-galeria-${n}`,
  grupo,
  nombre: `Galería · foto ${n}`,
  ayuda:
    n === 1
      ? "Foto grande de la galería, a la izquierda en computadora."
      : "Foto chica de la galería, a la derecha en computadora.",
  campos: ["imagen", "titulo"],
  proporcion: n === 1 ? "Vertical 4:5 o cuadrada (se recorta al centro)" : "Horizontal 3:2",
  notaFoto,
  defecto: { titulo: "", imagenAlt: notaFoto },
});

function cuadroFoto(
  clave: string,
  grupo: GrupoBloque,
  nombre: string,
  ayuda: string,
  notaFoto: string,
  defecto: DefinicionBloque["defecto"],
  proporcion = "Vertical 3:4",
): DefinicionBloque {
  return { clave, grupo, nombre, ayuda, campos: ["imagen", "titulo", "enlace"], proporcion, notaFoto, defecto };
}

const fotosColeccion = (para: "hombre" | "mujer", piezas: [string, string][]): DefinicionBloque[] =>
  piezas.map(([titulo, slug], i) =>
    cuadroFoto(
      `portada-col-${para}-${i + 1}`,
      "portada",
      `Colección ${para === "hombre" ? "Hombre" : "Mujer"} · foto ${i + 1}`,
      `Foto ${i + 1} de la fila «Colección ${para === "hombre" ? "Hombre" : "Mujer"}», en la portada.`,
      notaDe(titulo),
      {
        titulo,
        enlaceTexto: titulo,
        enlaceUrl: slug ? `/coleccion/${slug}?para=${para}` : `/coleccion?para=${para}`,
        imagenAlt: `${titulo} de la colección de ${para}`,
      },
    ),
  );

function notaDe(titulo: string) {
  return `${titulo.toLowerCase()} de piel, luz natural`;
}

const fotosMenu = (
  menu: "hombre" | "mujer" | "nosotros",
  piezas: { titulo: string; href: string; nota: string }[],
): DefinicionBloque[] =>
  piezas.map((p, i) =>
    cuadroFoto(
      `menu-${menu}-${i + 1}`,
      "menus",
      `Menú ${menu} · foto ${i + 1}`,
      `Foto ${i + 1} que aparece a la derecha del menú de ${menu}.`,
      p.nota,
      { titulo: p.titulo, enlaceTexto: p.titulo, enlaceUrl: p.href, imagenAlt: p.nota },
    ),
  );

export const BLOQUES: DefinicionBloque[] = [
  {
    clave: "global-anuncio",
    grupo: "global",
    nombre: "Barra de arriba",
    ayuda: "La franja café oscuro que se ve en todas las páginas, encima del menú.",
    ayudaTexto: "Hasta 3 avisos, uno por línea. Se van turnando solos cada 5 segundos.",
    campos: ["texto"],
    defecto: { texto: tienda.anuncio },
  },
  {
    clave: "portada-hombre",
    grupo: "portada",
    nombre: "Puerta Hombre",
    ayuda: "Foto grande de la portada, a la izquierda en computadora y arriba en el celular.",
    campos: ["imagen", "titulo", "enlace"],
    proporcion: "Vertical, de borde a borde",
    notaFoto: "hombre con calzado de piel, luz de tarde",
    defecto: {
      titulo: "Hombre",
      enlaceTexto: "Explorar Hombre",
      enlaceUrl: "/coleccion?para=hombre",
      imagenAlt: "Hombre con mocasines de piel",
    },
  },
  {
    clave: "portada-mujer",
    grupo: "portada",
    nombre: "Puerta Mujer",
    ayuda: "Foto grande de la portada, a la derecha en computadora y abajo en el celular.",
    campos: ["imagen", "titulo", "enlace"],
    proporcion: "Vertical, de borde a borde",
    notaFoto: "mujer con calzado de piel, luz de tarde",
    defecto: {
      titulo: "Mujer",
      enlaceTexto: "Explorar Mujer",
      enlaceUrl: "/coleccion?para=mujer",
      imagenAlt: "Mujer con botines de piel",
    },
  },
  ...fotosColeccion("hombre", [
    ["Temporada", ""],
    ["Mocasines", "mocasines"],
    ["Botas", "botas"],
  ]),
  ...fotosColeccion("mujer", [
    ["Temporada", ""],
    ["Mocasines", "mocasines"],
    ["Botines", "botas"],
  ]),
  {
    clave: "portada-oficio",
    grupo: "portada",
    nombre: "Bloque editorial",
    ayuda: "El único cuadro de texto de la portada, al final. Foto a la izquierda y texto a la derecha.",
    campos: ["imagen", "titulo", "texto", "enlace"],
    proporcion: "Vertical 4:5",
    notaFoto: "manos cortando piel en el taller",
    defecto: {
      titulo: "Hecho a mano, paso a paso",
      texto:
        "Cada par pasa por las manos de artesanos que cortan, cosen y montan la piel como se ha hecho por generaciones. Sin prisas y sin atajos, porque un buen zapato se nota con los años.",
      enlaceTexto: "Conoce la casa",
      enlaceUrl: "/nuestra-historia",
      imagenAlt: "Manos de artesano cortando piel",
    },
  },
  ...fotosMenu("hombre", [
    { titulo: "Temporada", href: "/coleccion?para=hombre", nota: "calzado de hombre, luz de tarde" },
    { titulo: "Mocasines", href: "/coleccion/mocasines?para=hombre", nota: "mocasines de piel café" },
    { titulo: "Botas", href: "/coleccion/botas?para=hombre", nota: "botas de piel sobre madera" },
  ]),
  ...fotosMenu("mujer", [
    { titulo: "Temporada", href: "/coleccion?para=mujer", nota: "calzado de mujer, luz natural" },
    { titulo: "Mocasines", href: "/coleccion/mocasines?para=mujer", nota: "mocasines coñac" },
    { titulo: "Botines", href: "/coleccion/botas?para=mujer", nota: "botines de piel" },
  ]),
  ...fotosMenu("nosotros", [
    { titulo: "Nuestra historia", href: "/nuestra-historia", nota: "vista del taller con luz natural" },
    { titulo: "El oficio", href: "/nuestra-historia", nota: "manos cortando piel" },
    { titulo: "El taller", href: "/nuestras-hormas", nota: "hormas de madera en el taller" },
  ]),
  {
    clave: "lookbook-intro",
    grupo: "lookbook",
    nombre: "Texto de la página",
    ayuda: "El título y la frase corta que se ven arriba de las fotos del lookbook.",
    campos: ["titulo", "texto"],
    defecto: {
      titulo: "La temporada",
      texto: "Piel café y coñac, luz de tarde y el oficio de siempre.",
    },
  },
  {
    clave: "historia-intro",
    grupo: "historia",
    nombre: "Encabezado",
    ayuda: "Título y foto grande al inicio de Nuestra historia.",
    campos: ["imagen", "titulo", "texto"],
    proporcion: "Horizontal 16:9",
    notaFoto: "vista del taller con luz natural",
    defecto: {
      titulo: "Un oficio que se hace sin prisa",
      texto: `${marca.nombre} nace en ${marca.fundada} con una idea sencilla: hacer calzado de piel que dure años y que se vea mejor con cada uno de ellos.`,
      imagenAlt: "Taller de calzado con luz natural",
    },
  },
  {
    clave: "historia-quien",
    grupo: "historia",
    nombre: `¿Quién es ${marca.nombre}?`,
    ayuda: "Foto y texto con la historia de la marca. Separa los párrafos con una línea en blanco.",
    campos: ["imagen", "titulo", "texto"],
    proporcion: "Vertical 4:5",
    notaFoto: "retrato del fundador en el taller",
    defecto: {
      titulo: `¿Quién es ${marca.nombre}?`,
      texto:
        "Aquí va la historia del nombre y de la persona detrás de la marca: de dónde viene, qué la inspiró y por qué el calzado hecho a mano.\n\nEs el espacio para contar lo que hace diferente a cada par: la piel que se elige, el taller donde se trabaja y las manos que lo hacen.",
      imagenAlt: "Retrato del fundador en el taller",
    },
  },
  galeria(1, "hormas de madera y rollo de piel", "historia"),
  galeria(2, "pieles en coñac, café y olivo", "historia"),
  galeria(3, "par terminado sobre madera", "historia"),
];

export function definicionBloque(clave: string) {
  return BLOQUES.find((b) => b.clave === clave);
}
