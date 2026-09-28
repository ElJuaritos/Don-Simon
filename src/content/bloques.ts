import { marca } from "@/config/marca";

// Cuadros editables (foto + textos) de la portada y de Nuestra historia.
// Aquí se define qué cuadros existen, qué campos tiene cada uno y su texto por defecto.
// Lo que el dueño cambia desde /admin/contenido se guarda en la tabla `bloques`
// y tiene prioridad sobre estos valores.

export type CampoBloque = "titulo" | "texto" | "enlace" | "imagen";
export type GrupoBloque = "portada" | "historia";

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
};

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

export const BLOQUES: DefinicionBloque[] = [
  {
    clave: "portada-hero",
    grupo: "portada",
    nombre: "Foto principal",
    ayuda: "Lo primero que se ve al entrar. Ocupa toda la pantalla.",
    campos: ["imagen", "titulo", "texto", "enlace"],
    proporcion: "Horizontal 16:9 (en el celular se recorta al centro)",
    notaFoto: "mocasín sobre piedra, luz de tarde",
    defecto: {
      titulo: "Hecho a mano, pensado para durar",
      texto: "Calzado de piel cosido por artesanos mexicanos.",
      enlaceTexto: "Ver colección",
      enlaceUrl: "/coleccion",
      imagenAlt: "Mocasín de piel sobre piedra con luz de tarde",
    },
  },
  {
    clave: "portada-hombre",
    grupo: "portada",
    nombre: "Cuadro Hombre",
    ayuda: "Cuadro izquierdo debajo de la foto principal. Lleva a los modelos de hombre.",
    campos: ["imagen", "titulo", "enlace"],
    proporcion: "Vertical 4:5",
    notaFoto: "retrato de hombre con mocasines",
    defecto: { titulo: "Hombre", enlaceTexto: "Ver hombre", enlaceUrl: "/coleccion?para=hombre", imagenAlt: "Hombre con mocasines de piel" },
  },
  {
    clave: "portada-mujer",
    grupo: "portada",
    nombre: "Cuadro Mujer",
    ayuda: "Cuadro derecho debajo de la foto principal. Lleva a los modelos de mujer.",
    campos: ["imagen", "titulo", "enlace"],
    proporcion: "Vertical 4:5",
    notaFoto: "retrato de mujer con botines",
    defecto: { titulo: "Mujer", enlaceTexto: "Ver mujer", enlaceUrl: "/coleccion?para=mujer", imagenAlt: "Mujer con botines de piel" },
  },
  {
    clave: "portada-manifiesto",
    grupo: "portada",
    nombre: "Frase de la marca",
    ayuda: "Texto grande centrado, sin foto, entre los cuadros y las categorías.",
    campos: ["titulo", "texto"],
    defecto: {
      titulo: "Piel que mejora con los años.",
      texto:
        "Elegimos cada piel, la cortamos y la cosemos a mano. No seguimos temporadas: hacemos zapatos para usarse mucho tiempo.",
    },
  },
  {
    clave: "portada-oficio",
    grupo: "portada",
    nombre: "El oficio",
    ayuda: "Foto a la izquierda y texto a la derecha, debajo de las novedades.",
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
  {
    clave: "portada-hormas",
    grupo: "portada",
    nombre: "Nuestras hormas",
    ayuda: "Texto a la izquierda y foto a la derecha, después de El oficio.",
    campos: ["imagen", "titulo", "texto", "enlace"],
    proporcion: "Vertical 4:5",
    notaFoto: "hormas de madera en el taller",
    defecto: {
      titulo: "Todo empieza en la horma",
      texto:
        "La horma es el molde sobre el que se construye cada zapato. Define cómo te queda, dónde aprieta y dónde no. Por eso cada modelo te dice en qué horma está hecho.",
      enlaceTexto: "Conoce nuestras hormas",
      enlaceUrl: "/nuestras-hormas",
      imagenAlt: "Hormas de madera sobre la mesa del taller",
    },
  },
  galeria(1, "par terminado sobre madera vieja", "portada"),
  galeria(2, "detalle de costura a mano", "portada"),
  galeria(3, "herramientas: lezna, tijeras, hilo", "portada"),
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
  galeria(1, "herramientas del taller", "historia"),
  galeria(2, "piel con el logo grabado", "historia"),
  galeria(3, "par terminado sobre madera", "historia"),
];

export function definicionBloque(clave: string) {
  return BLOQUES.find((b) => b.clave === clave);
}
