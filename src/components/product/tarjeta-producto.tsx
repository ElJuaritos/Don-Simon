import Link from "next/link";
import type { ProductoListado } from "@/lib/data/catalogo";
import { FotoProducto } from "@/components/ui/foto";
import { Precio } from "./precio";

export function TarjetaProducto({ producto, prioridad = false }: { producto: ProductoListado; prioridad?: boolean }) {
  const badge = !producto.disponible
    ? { texto: "Agotado", clase: "bg-cafe text-crema-claro" }
    : producto.precioComparacion && producto.precioComparacion > producto.precio
      ? { texto: "Oferta", clase: "bg-terracota text-white" }
      : producto.ultimosPares
        ? { texto: "Últimos pares", clase: "bg-white text-cafe" }
        : null;

  return (
    <Link href={`/producto/${producto.slug}`} className="group block">
      <div className="relative">
        <FotoProducto
          imagen={producto.imagen}
          colorZapato={producto.colores[0]?.hex}
          prioridad={prioridad}
          className="aspect-[4/5] transition-transform duration-700 ease-suave group-hover:scale-[1.02]"
        />
        {badge && (
          <span className={`etiqueta absolute left-3 top-3 px-2.5 py-1 text-[0.625rem] ${badge.clase}`}>
            {badge.texto}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold leading-snug">{producto.nombre}</h3>
          <p className="mt-0.5 text-sm text-cafe/85">{producto.categoria.nombre}</p>
        </div>
        <Precio precio={producto.precio} comparacion={producto.precioComparacion} className="shrink-0" />
      </div>
      {producto.colores.length > 0 && (
        <div className="mt-2.5 flex items-center gap-1.5" aria-label={`Colores: ${producto.colores.map((c) => c.nombre).join(", ")}`}>
          {producto.colores.map((c) => (
            <span
              key={c.nombre}
              title={c.nombre}
              className="h-3.5 w-3.5 rounded-full border border-cafe/20"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      )}
    </Link>
  );
}

export function RejillaProductos({ productos }: { productos: ProductoListado[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
      {productos.map((p, i) => (
        <li key={p.id}>
          <TarjetaProducto producto={p} prioridad={i < 4} />
        </li>
      ))}
    </ul>
  );
}
