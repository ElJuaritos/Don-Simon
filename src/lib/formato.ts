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

export function folio(numero: number) {
  return `DS-${10000 + numero}`;
}

const fechaFmt = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "America/Mexico_City",
});

export function formatFecha(fecha: Date) {
  return fechaFmt.format(fecha);
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
