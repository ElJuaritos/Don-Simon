// Enlaces de navegación compartidos por el header, el menú móvil y el footer.

export type Enlace = { href: string; texto: string };

export const TIENDA_PUBLICO: Enlace[] = [
  { href: "/coleccion?para=hombre", texto: "Hombre" },
  { href: "/coleccion?para=mujer", texto: "Mujer" },
];

export const LA_CASA: Enlace[] = [
  { href: "/nuestra-historia", texto: "Nuestra historia" },
  { href: "/nuestras-hormas", texto: "Nuestras hormas" },
  { href: "/ayuda/cuidado-del-calzado", texto: "Cuidado del calzado" },
];

export const AYUDA: Enlace[] = [
  { href: "/ayuda/guia-de-tallas", texto: "Guía de tallas" },
  { href: "/ayuda/envios", texto: "Envíos" },
  { href: "/ayuda/cambios-y-devoluciones", texto: "Cambios y devoluciones" },
  { href: "/ayuda/preguntas-frecuentes", texto: "Preguntas frecuentes" },
  { href: "/contacto", texto: "Contacto" },
];
