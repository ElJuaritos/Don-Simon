import Link from "next/link";
import type { ProductoListado } from "@/lib/data/catalogo";
import { FotoProducto } from "@/components/ui/foto";
import { Precio } from "./precio";

// Una tarjeta por color. La foto va sobre arena; el nombre y el precio, en la misma línea.

function badgeDe(producto: ProductoListado) {
  if (!producto.disponible) return "Agotado";
  if (producto.precioComparacion && producto.precioComparacion > producto.precio) return "Oferta";
  if (producto.ultimosPares) return "Últimos pares";
  if (producto.nuevo) return "Nuevo";
  return null;
}

export function TarjetaProducto({ producto, prioridad = false }: { producto: ProductoListado; prioridad?: boolean }) {
  const badge = badgeDe(producto);
  const href = `/producto/${producto.slug}?color=${encodeURIComponent(producto.color)}`;

  return (
    <Link href={href} className="group block">
      <div className="relative">
        <FotoProducto
          imagen={producto.imagen}
          segunda={producto.imagenSecundaria}
          colorZapato={producto.colorHex}
          prioridad={prioridad}
          zoomAlPasar={!producto.imagenSecundaria}
          className="aspect-[4/5] bg-arena"
        />
        {badge && <span className="absolute top-3 left-3 text-[0.75rem] font-medium text-cafe">{badge}</span>}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="texto-nav min-w-0 truncate">{producto.nombre}</h3>
        <Precio precio={producto.precio} comparacion={producto.precioComparacion} className="texto-nav shrink-0" />
      </div>
      <p className="texto-nav mt-1 text-cafe/70">{producto.color}</p>
    </Link>
  );
}

export function RejillaProductos({ productos }: { productos: ProductoListado[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 lg:grid-cols-4 lg:gap-y-14">
      {productos.map((p, i) => (
        <li key={`${p.id}-${p.color}`}>
          <TarjetaProducto producto={p} prioridad={i < 4} />
        </li>
      ))}
    </ul>
  );
}
