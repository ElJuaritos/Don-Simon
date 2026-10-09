import { OCASIONES, type Ocasion } from "@/db/schema";
import { formatTalla } from "@/lib/formato";

// Lectura y armado de la URL del catálogo. Sirve en el servidor y en el formulario.
// Dentro de un filtro, varios valores se combinan (dos tallas = cualquiera de las dos).

export const POR_PAGINA = 24;

export type Para = "hombre" | "mujer";

export type FiltrosUrl = {
  para?: Para;
  estilos: string[];
  tallas: string[];
  colores: string[];
  materiales: string[];
  ocasiones: Ocasion[];
  orden: string;
  pagina: number;
};

type Crudo = Record<string, string | string[] | undefined>;

function lista(valor: string | string[] | undefined) {
  if (!valor) return [];
  return (Array.isArray(valor) ? valor : [valor]).map((v) => v.trim()).filter(Boolean);
}

export function leerFiltros(sp: Crudo, estiloDeRuta?: string): FiltrosUrl {
  const para = sp.para === "hombre" || sp.para === "mujer" ? sp.para : undefined;
  const estilos = lista(sp.estilo);
  const pagina = Number(Array.isArray(sp.pagina) ? sp.pagina[0] : sp.pagina);
  const ocasiones = lista(sp.ocasion).filter((o): o is Ocasion => (OCASIONES as readonly string[]).includes(o));
  return {
    para,
    estilos: estilos.length > 0 ? estilos : estiloDeRuta ? [estiloDeRuta] : [],
    tallas: lista(sp.talla),
    colores: lista(sp.color),
    materiales: lista(sp.material),
    ocasiones,
    orden: (Array.isArray(sp.orden) ? sp.orden[0] : sp.orden) || "destacados",
    pagina: Number.isFinite(pagina) && pagina > 1 ? Math.floor(pagina) : 1,
  };
}

/** El estilo que viene de /coleccion/[categoria] no está en la query, pero sí está activo. */
export function estiloVieneDeLaRuta(sp: Crudo, estiloDeRuta?: string) {
  return Boolean(estiloDeRuta) && lista(sp.estilo).length === 0;
}

export function paramsDe(filtros: FiltrosUrl, extra?: { estiloEnRuta?: boolean }) {
  const params = new URLSearchParams();
  if (filtros.para) params.set("para", filtros.para);
  const estilos = extra?.estiloEnRuta ? [] : filtros.estilos;
  for (const v of estilos) params.append("estilo", v);
  for (const v of filtros.tallas) params.append("talla", v);
  for (const v of filtros.colores) params.append("color", v);
  for (const v of filtros.materiales) params.append("material", v);
  for (const v of filtros.ocasiones) params.append("ocasion", v);
  if (filtros.orden && filtros.orden !== "destacados") params.set("orden", filtros.orden);
  if (filtros.pagina > 1) params.set("pagina", String(filtros.pagina));
  return params;
}

export function hrefColeccion(base: string, filtros: FiltrosUrl, extra?: { estiloEnRuta?: boolean }) {
  const qs = paramsDe(filtros, extra).toString();
  return qs ? `${base}?${qs}` : base;
}

export function quitarValor(filtros: FiltrosUrl, clave: "estilos" | "tallas" | "colores" | "materiales" | "ocasiones", valor: string) {
  return {
    ...filtros,
    pagina: 1,
    [clave]: filtros[clave].filter((v) => v !== valor),
  };
}

export const ETIQUETA_OCASION: Record<Ocasion, string> = {
  formal: "Formal",
  casual: "Casual",
  boda: "Boda",
};

/** Texto del filtro: "Talla 25.5", "Talla 85 cm" o "Talla única". */
export function etiquetaTalla(valor: string) {
  if (valor === "Única") return "Talla única";
  const n = Number(valor);
  return Number.isFinite(n) && valor.trim() !== "" ? `Talla ${formatTalla(n)}` : `Talla ${valor}`;
}
