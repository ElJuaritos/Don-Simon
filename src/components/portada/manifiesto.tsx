import type { BloqueResuelto } from "@/lib/data/contenido";

/** Frase grande de la marca, centrada y con mucho aire alrededor. */
export function Manifiesto({ bloque }: { bloque: BloqueResuelto }) {
  if (!bloque.titulo && !bloque.texto) return null;
  return (
    <section className="contenedor seccion revelar text-center">
      {bloque.titulo && (
        <h2 className="titulo-display mx-auto max-w-4xl text-4xl md:text-6xl">{bloque.titulo}</h2>
      )}
      {bloque.texto && <p className="mx-auto mt-8 max-w-xl text-lg">{bloque.texto}</p>}
    </section>
  );
}
