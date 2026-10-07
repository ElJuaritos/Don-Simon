export type RegistroCp = {
  estado: string;
  municipio: string;
  ciudad: string;
  colonias: string[];
};

/** Nombres oficiales de SEPOMEX que en el formulario van con la etiqueta corta. */
const ALIAS_ESTADO: Record<string, string> = {
  México: "Estado de México",
  Mexico: "Estado de México",
  "Distrito Federal": "Ciudad de México",
  "Coahuila de Zaragoza": "Coahuila",
  "Michoacán de Ocampo": "Michoacán",
  "Veracruz de Ignacio de la Llave": "Veracruz",
};

/** La ciudad del catálogo, o el municipio cuando SEPOMEX no trae ciudad o repite el estado. */
export function localidadCp(fila: Pick<RegistroCp, "estado" | "municipio" | "ciudad">) {
  const ciudad = fila.ciudad?.trim() ?? "";
  if (ciudad && ciudad !== fila.estado) return ciudad;
  return fila.municipio;
}

/** Pide un solo código. Si no está en el catálogo, el formulario sigue en manual. */
export async function consultarCp(cp: string): Promise<RegistroCp | null> {
  if (!/^\d{5}$/.test(cp)) return null;
  try {
    const res = await fetch(`/api/cp/${cp}`);
    if (!res.ok) return null;
    const fila = (await res.json()) as RegistroCp;
    if (!fila?.estado || !fila.municipio) return null;
    return {
      estado: ALIAS_ESTADO[fila.estado] ?? fila.estado,
      municipio: fila.municipio,
      ciudad: fila.ciudad ?? "",
      colonias: Array.isArray(fila.colonias) ? fila.colonias : [],
    };
  } catch {
    return null;
  }
}
