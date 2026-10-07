import type { ReactNode } from "react";
import { CarruselProductos } from "./carrusel-productos";

/**
 * Espacio para accesorios del modelo. No se muestra mientras no haya productos
 * que sugerir: el dueño todavía no define qué accesorios vende.
 */
export function CombinarloCon({ productos }: { productos: ReactNode[] }) {
  if (productos.length === 0) return null;
  return (
    <section className="contenedor py-16" aria-labelledby="titulo-combinarlo">
      <h2 id="titulo-combinarlo" className="titulo-display mb-8 text-4xl">
        Combínalo con
      </h2>
      <CarruselProductos etiqueta="Combínalo con">{productos}</CarruselProductos>
    </section>
  );
}
