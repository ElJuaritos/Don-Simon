/** Hasta tres avisos, uno por línea. Las líneas vacías se ignoran. */
export function mensajesAnuncio(texto: string) {
  return texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 3);
}
