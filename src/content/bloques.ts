import { marca, tienda } from "@/config/marca";

// Cuadros editables (foto + textos) de la portada, los menús y Nuestra historia.
// Aquí se define qué cuadros existen, qué campos tiene cada uno y su texto por defecto.
// Lo que el dueño cambia desde /admin/contenido se guarda en la tabla `bloques`
// y tiene prioridad sobre estos valores.

export type CampoBloque = "titulo" | "texto" | "enlace" | "imagen";
export type GrupoBloque = "portada" | "historia" | "oficio" | "global" | "menus" | "lookbook" | "publico";

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
  oficio: { nombre: "El oficio", ruta: "/el-oficio" },
  global: { nombre: "Aviso de arriba", ruta: "/" },
  menus: { nombre: "Fotos de los menús", ruta: "/" },
  publico: { nombre: "Hombre y Mujer", ruta: "/hombre" },
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

function heroes(para: "hombre" | "mujer"): DefinicionBloque[] {
  const etiqueta = para === "hombre" ? "Hombre" : "Mujer";
  return [1, 2].map((n) => ({
    clave: `${para}-hero-${n}`,
    grupo: "publico" as const,
    nombre: `${etiqueta} · cuadro ${n}`,
    ayuda: `Cuadro grande ${n} de la página /${para}. El botón «Explorar» usa el enlace de abajo.`,
    campos: ["imagen", "titulo", "enlace"],
    proporcion: "Vertical, casi a pantalla completa",
    notaFoto: `${etiqueta.toLowerCase()} con calzado de piel, luz de tarde`,
    defecto: {
      titulo: etiqueta,
      enlaceTexto: "Explorar",
      enlaceUrl: n === 1 ? `/coleccion/mocasines?para=${para}` : `/coleccion/botas?para=${para}`,
      imagenAlt: `Calzado de ${etiqueta.toLowerCase()}`,
    },
  }));
}

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
      enlaceUrl: "/hombre",
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
      enlaceUrl: "/mujer",
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
    { titulo: "Temporada", href: "/hombre", nota: "calzado de hombre, luz de tarde" },
    { titulo: "Mocasines", href: "/coleccion/mocasines?para=hombre", nota: "mocasines de piel café" },
    { titulo: "Botas", href: "/coleccion/botas?para=hombre", nota: "botas de piel sobre madera" },
  ]),
  ...fotosMenu("mujer", [
    { titulo: "Temporada", href: "/mujer", nota: "calzado de mujer, luz natural" },
    { titulo: "Mocasines", href: "/coleccion/mocasines?para=mujer", nota: "mocasines coñac" },
    { titulo: "Botines", href: "/coleccion/botas?para=mujer", nota: "botines de piel" },
  ]),
  ...fotosMenu("nosotros", [
    { titulo: "Nuestra historia", href: "/nuestra-historia", nota: "vista del taller con luz natural" },
    { titulo: "El oficio", href: "/el-oficio", nota: "manos cortando piel" },
    { titulo: "El taller", href: "/nuestras-hormas", nota: "hormas de madera en el taller" },
  ]),
  ...heroes("hombre"),
  ...heroes("mujer"),
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
  ...bloquesHistoria(),
  galeria(1, "hormas de madera y rollo de piel", "historia"),
  galeria(2, "pieles en coñac, café y olivo", "historia"),
  galeria(3, "par terminado sobre madera", "historia"),
  ...bloquesOficio(),
];

/** Filosofía, valores y sostenibilidad. Textos cortos para que el dueño los reemplace. */
function bloquesHistoria(): DefinicionBloque[] {
  const piezas: [string, string, string, string][] = [
    [
      "historia-filosofia",
      "Filosofía",
      "Un par que se usa de verdad",
      "Hacemos calzado para el día a día: piel que se siente, horma que acompaña y un acabado que se ve mejor con el uso.\n\nLa idea es simple. Menos prisa, más oficio.",
    ],
    [
      "historia-valores",
      "Valores",
      "Cuidado en cada paso",
      "Elegimos materiales con calma y trabajamos cada par con atención. Preferimos decir poco y hacerlo bien.\n\nLo que prometemos cabe en una frase: un zapato honesto, hecho para durar.",
    ],
    [
      "historia-sostenibilidad",
      "Sostenibilidad",
      "Hacer menos, y que dure",
      "Un zapato que se repara y se usa por años pesa menos que uno que se cambia cada temporada.\n\nAquí irá cómo cuidamos los materiales y el taller, cuando esos datos estén listos.",
    ],
  ];
  return piezas.map(([clave, nombre, titulo, texto]) => ({
    clave,
    grupo: "historia",
    nombre,
    ayuda: `Cuadro de ${nombre.toLowerCase()} en Nuestra historia. Foto y texto, uno al lado del otro.`,
    campos: ["imagen", "titulo", "texto"],
    proporcion: "Vertical 4:5",
    notaFoto: `${nombre.toLowerCase()}, luz cálida de taller`,
    defecto: { titulo, texto, imagenAlt: nombre },
  }));
}

/** Pasos del oficio, tipos de construcción y galería. Si un título queda vacío, ese cuadro no se muestra. */
function bloquesOficio(): DefinicionBloque[] {
  const pasos: [string, string, string][] = [
    ["Patrón", "El patrón", "El patrón marca la forma de cada pieza. Se traza sobre la piel según la horma y la talla."],
    ["Corte", "El corte", "Se corta con cuidado para aprovechar la piel y respetar su dirección."],
    ["Cosido", "El cosido", "Las piezas se unen a mano o a máquina, según el modelo, con hilo que aguante el uso."],
    ["Montado", "El montado", "La piel se monta sobre la horma. Ahí el zapato toma su forma definitiva."],
    ["Acabado", "El acabado", "Se pule, se tiñe el canto si hace falta y se revisa el par antes de salir del taller."],
  ];
  const construcciones: [string, string, string][] = [
    [
      "Goodyear",
      "Goodyear",
      "Una cinta de tela cose la parte de arriba con la suela. Se puede cambiar la suela sin desarmar el zapato.",
    ],
    ["Blake", "Blake", "Una sola costura une la parte de arriba, la plantilla y la suela. El par queda más flexible."],
    ["Cementado", "Cementado", "La suela se pega. Es una construcción más ligera, útil en modelos de uso diario."],
  ];
  return [
    {
      clave: "oficio-intro",
      grupo: "oficio",
      nombre: "Encabezado",
      ayuda: "Título y texto al inicio de El oficio.",
      campos: ["imagen", "titulo", "texto"],
      proporcion: "Horizontal 16:9",
      notaFoto: "banco de trabajo con herramientas",
      defecto: {
        titulo: "De la piel al par",
        texto: "Así se construye un zapato en el taller. Cada paso tiene su tiempo.",
        imagenAlt: "Banco de trabajo del taller",
      },
    },
    ...pasos.map(
      ([nombre, titulo, texto], i): DefinicionBloque => ({
        clave: `oficio-paso-${i + 1}`,
        grupo: "oficio",
        nombre: `Paso ${i + 1} · ${nombre}`,
        ayuda: `Paso ${i + 1} del proceso. Si quitas el título, este paso deja de mostrarse.`,
        campos: ["imagen", "titulo", "texto"],
        proporcion: "Vertical 4:5",
        notaFoto: `${nombre.toLowerCase()} en el taller`,
        defecto: { titulo, texto, imagenAlt: nombre },
      }),
    ),
    ...construcciones.map(
      ([nombre, titulo, texto], i): DefinicionBloque => ({
        clave: `oficio-construccion-${i + 1}`,
        grupo: "oficio",
        nombre: `Construcción · ${nombre}`,
        ayuda: "Tipo de construcción en «Cómo se construye». Si el título queda vacío, no se muestra.",
        campos: ["imagen", "titulo", "texto"],
        proporcion: "Vertical 4:5",
        notaFoto: `detalle de construcción ${nombre.toLowerCase()}`,
        defecto: { titulo, texto, imagenAlt: nombre },
      }),
    ),
    galeria(1, "detalle de costura", "oficio"),
    galeria(2, "piel sobre la mesa de corte", "oficio"),
    galeria(3, "par recién terminado", "oficio"),
  ];
}

export function definicionBloque(clave: string) {
  return BLOQUES.find((b) => b.clave === clave);
}
