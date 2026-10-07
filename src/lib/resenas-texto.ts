import type { AnchoPie, EstadoResena } from "@/db/schema";

/** Nombre y la inicial del apellido: "Alejandro R.". */
export function nombreParaMostrar(nombre: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  if (partes.length === 1) return partes[0];
  const inicial = partes[partes.length - 1][0]?.toLocaleUpperCase("es-MX") ?? "";
  return `${partes[0]} ${inicial}.`;
}

export const OPCIONES_AJUSTE = [
  { valor: -2, etiqueta: "Muy chico" },
  { valor: -1, etiqueta: "Un poco chico" },
  { valor: 0, etiqueta: "Fiel a la talla" },
  { valor: 1, etiqueta: "Un poco grande" },
  { valor: 2, etiqueta: "Muy grande" },
] as const;

export const ETIQUETA_ANCHO: Record<AnchoPie, string> = {
  angosto: "Angosto",
  normal: "Normal",
  ancho: "Ancho",
};

/** El filtro del admin. Si el valor no es un estado, se queda en pendientes. */
export function estadoResenaValido(valor: string | undefined): EstadoResena {
  if (valor === "publicada" || valor === "rechazada") return valor;
  return "pendiente";
}

export function formatPromedio(n: number) {
  const r = Math.round(n * 10) / 10;
  return Number.isInteger(r) ? String(r) : r.toFixed(1);
}

/** Texto del indicador según el promedio de ajuste (−2 a 2). */
export function textoAjuste(promedio: number) {
  if (promedio < -1.25) return "Queda muy chico";
  if (promedio < -0.4) return "Queda un poco chico";
  if (promedio <= 0.4) return "Fiel a la talla";
  if (promedio <= 1.25) return "Queda un poco grande";
  return "Queda muy grande";
}

export function posicionAjuste(promedio: number) {
  const p = ((promedio + 2) / 4) * 100;
  return Math.min(100, Math.max(0, p));
}
