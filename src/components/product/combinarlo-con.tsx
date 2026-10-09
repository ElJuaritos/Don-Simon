import type { ProductoListado } from "@/lib/data/catalogo";
import { CarruselProductos } from "./carrusel-productos";
import { TarjetaProducto } from "./tarjeta-producto";

/** Accesorios para acompañar el modelo. No se muestra si no hay ninguno. */
export function CombinarloCon({ productos }: { productos: ProductoListado[] }) {
  if (productos.length === 0) return null;
  return (
    <section className="contenedor py-16" aria-labelledby="titulo-combinarlo">
      <h2 id="titulo-combinarlo" className="titulo-display mb-8 text-4xl">
        Combínalo con
      </h2>
      <CarruselProductos etiqueta="Combínalo con">
        {productos.map((p) => (
          <TarjetaProducto key={`${p.id}-${p.color}`} producto={p} />
        ))}
      </CarruselProductos>
    </section>
  );
}
