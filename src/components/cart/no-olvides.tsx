"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { agregarAlCarrito, obtenerSugerenciasCarrito, type EstadoAgregar } from "@/lib/actions/tienda";
import { formatPrecio } from "@/lib/formato";
import { FotoProducto } from "@/components/ui/foto";
import { CarruselProductos } from "@/components/product/carrusel-productos";
import { useCarrito } from "./proveedor-carrito";

type Sugerencia = Awaited<ReturnType<typeof obtenerSugerenciasCarrito>>[number];

/** Sugerencias al final del carrito. No aparece si no hay ninguna. */
export function NoOlvidesAgregar({ id = "titulo-no-olvides" }: { id?: string }) {
  const { carrito } = useCarrito();
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const clave = carrito.lineas.map((l) => l.productoId).join(",");

  useEffect(() => {
    let vivo = true;
    obtenerSugerenciasCarrito().then((lista) => {
      if (vivo) setSugerencias(lista);
    });
    return () => {
      vivo = false;
    };
  }, [clave]);

  if (sugerencias.length === 0) return null;

  return (
    <section className="border-t border-negro/10 py-6" aria-labelledby={id}>
      <h2 id={id} className="text-sm font-medium">
        No olvides agregar
      </h2>
      <div className="mt-4">
        <CarruselProductos etiqueta="No olvides agregar">
          {sugerencias.map((s) => (
            <TarjetaSugerencia key={s.productoId} sugerencia={s} />
          ))}
        </CarruselProductos>
      </div>
    </section>
  );
}

function TarjetaSugerencia({ sugerencia }: { sugerencia: Sugerencia }) {
  const [estado, accion, enviando] = useActionState(agregarAlCarrito, undefined);
  const { abrir } = useCarrito();
  const router = useRouter();
  const visto = useRef<EstadoAgregar>(undefined);
  const boton = useRef<HTMLButtonElement>(null);
  const href = `/producto/${sugerencia.slug}?color=${encodeURIComponent(sugerencia.color)}`;

  useEffect(() => {
    if (!estado?.ok || !estado.carrito || estado === visto.current) return;
    visto.current = estado;
    abrir({ carrito: estado.carrito, agregadoId: estado.agregadoId, desde: boton.current });
    router.refresh();
  }, [estado, abrir, router]);

  return (
    <article className="w-40">
      <Link href={href}>
        <FotoProducto imagen={sugerencia.imagen} sizes="160px" className="aspect-[4/5] bg-niebla" />
      </Link>
      <p className="mt-2 truncate text-sm font-medium">{sugerencia.nombre}</p>
      <p className="text-sm text-negro/70">{formatPrecio(sugerencia.precio)}</p>
      {sugerencia.varianteId ? (
        <form action={accion} className="mt-2">
          <input type="hidden" name="varianteId" value={sugerencia.varianteId} />
          <button
            ref={boton}
            type="submit"
            name="destino"
            value="carrito"
            disabled={enviando}
            aria-label={`Agregar ${sugerencia.nombre}`}
            className="btn-contorno w-full px-3 py-2 text-sm"
          >
            {enviando ? "Agregando…" : "Agregar"}
          </button>
          {estado?.error && <p className="mt-1 text-xs text-pizarra-oscuro">{estado.error}</p>}
        </form>
      ) : (
        <Link href={href} aria-label={`Elegir talla y color de ${sugerencia.nombre}`} className="btn-contorno mt-2 w-full px-3 py-2 text-sm">
          Elegir
        </Link>
      )}
    </article>
  );
}
