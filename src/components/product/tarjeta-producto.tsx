import Link from "next/link";
import type { ProductoListado } from "@/lib/data/catalogo";
import { FotoProducto } from "@/components/ui/foto";
import { Precio } from "./precio";

// Tarjeta de producto: la foto manda; nombre, precio y colores quedan discretos debajo.

export function TarjetaProducto({ producto, prioridad = false }: { producto: ProductoListado; prioridad?: boolean }) {
  const badge = !producto.disponible
    ? "Agotado"
    : producto.precioComparacion && producto.precioComparacion > producto.precio
      ? "Oferta"
      : producto.ultimosPares
        ? "Últimos pares"
        : null;

  return (
    <Link href={`/producto/${producto.slug}`} className="group block">
      <div className="relative">
        <FotoProducto
          imagen={producto.imagen}
          colorZapato={producto.colores[0]?.hex}
          prioridad={prioridad}
          zoomAlPasar
          className="aspect-[4/5]"
        />
        {badge && (
          <span className="etiqueta absolute left-3 top-3 bg-hueso/90 px-2.5 py-1 text-[0.625rem]">{badge}</span>
        )}
      </div>
      {/* En celular el precio va debajo del nombre: si el nombre ocupa dos renglones, las tarjetas vecinas no se desalinean */}
      <div className="mt-4 flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <h3 className="font-medium leading-snug">{producto.nombre}</h3>
        <Precio precio={producto.precio} comparacion={producto.precioComparacion} className="shrink-0 text-[0.9375rem]" />
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <p className="text-sm text-cafe/85">{producto.categoria.nombre}</p>
        {producto.colores.length > 0 && (
          <div className="flex items-center gap-1.5" aria-label={`Colores: ${producto.colores.map((c) => c.nombre).join(", ")}`}>
            {producto.colores.map((c) => (
              <span
                key={c.nombre}
                title={c.nombre}
                className="h-3 w-3 rounded-full border border-cafe/20"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export function RejillaProductos({ productos }: { productos: ProductoListado[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-12 md:gap-x-5 lg:grid-cols-4">
      {productos.map((p, i) => (
        <li key={p.id}>
          <TarjetaProducto producto={p} prioridad={i < 4} />
        </li>
      ))}
    </ul>
  );
}
