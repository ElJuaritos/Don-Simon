const precioFmt = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

/** Formatea centavos como precio: 349000 → "$3,490" */
export function formatPrecio(centavos: number) {
  return precioFmt.format(centavos / 100);
}

/** 25.5 → "25.5", 26 → "26" */
export function formatTalla(talla: number) {
  return Number.isInteger(talla) ? String(talla) : talla.toFixed(1);
}

type ConTalla = { talla: number | string | null; etiquetaTalla?: string | null };

function tallaNumero(talla: number | string | null | undefined) {
  if (talla == null || talla === "") return null;
  const n = typeof talla === "number" ? talla : Number(talla);
  return Number.isFinite(n) ? n : null;
}

/**
 * Talla de calzado ("25.5"), etiqueta de accesorio ("85 cm") o "Talla única".
 * Sirve en la ficha, el carrito, el pedido y el admin.
 */
export function etiquetaDeTalla(item: ConTalla) {
  const etiqueta = item.etiquetaTalla?.trim();
  if (etiqueta) return etiqueta;
  const talla = tallaNumero(item.talla);
  if (talla != null) return formatTalla(talla);
  return "Talla única";
}

/** "Talla 25.5", "Talla 85 cm" o "Talla única", para ponerla junto al color. */
export function textoDeTalla(item: ConTalla) {
  const etiqueta = etiquetaDeTalla(item);
  return etiqueta === "Talla única" ? etiqueta : `Talla ${etiqueta}`;
}

export function folio(numero: number) {
  return `DS-${10000 + numero}`;
}

/** Acepta el folio visible (DS-10034 o 10034) y también el número interno. */
export function numeroDeFolio(texto: string): number | null {
  const limpio = texto.trim().toUpperCase().replace(/\s/g, "").replace(/^DS-/, "");
  if (!/^\d{1,6}$/.test(limpio)) return null;
  const n = Number(limpio);
  return n >= 10000 ? n - 10000 : n;
}

const fechaFmt = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Mexico_City",
});

export function formatFecha(fecha: Date) {
  return fechaFmt.format(fecha);
}

const diaFmt = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "long",
  timeZone: "America/Mexico_City",
});

/** Fecha sin hora, para las notas. */
export function formatDia(fecha: Date) {
  return diaFmt.format(fecha);
}

export function slugify(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Convierte "3,490.50" o "3490" (pesos) a centavos */
export function pesosACentavos(valor: string) {
  const n = Number(valor.replace(/[$,\s]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
}
