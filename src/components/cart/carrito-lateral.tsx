"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { tienda } from "@/config/marca";
import { formatPrecio, formatTalla } from "@/lib/formato";
import { FotoProducto } from "@/components/ui/foto";
import { PanelLateral } from "@/components/ui/panel-lateral";
import { CarruselProductos } from "@/components/product/carrusel-productos";
import { useCarrito } from "./proveedor-carrito";

/** Oculto mientras no haya accesorios que sugerir. */
function NoOlvidesAgregar({ productos }: { productos: ReactNode[] }) {
  if (productos.length === 0) return null;
  return (
    <section className="border-t border-negro/10 py-6" aria-labelledby="titulo-no-olvides">
      <h3 id="titulo-no-olvides" className="text-sm font-medium">
        No olvides agregar
      </h3>
      <div className="mt-4">
        <CarruselProductos etiqueta="No olvides agregar">{productos}</CarruselProductos>
      </div>
    </section>
  );
}

function Controles({
  varianteId,
  cantidad,
  max,
  nombre,
}: {
  varianteId: string;
  cantidad: number;
  max: number;
  nombre: string;
}) {
  const { fijarCantidad, pendiente } = useCarrito();
  return (
    <div className="mt-3 flex items-center gap-3">
      <div className="flex items-center border border-negro/25">
        <button
          type="button"
          className="grid h-9 w-9 place-items-center disabled:text-negro/60"
          aria-label={`Quitar un par de ${nombre}`}
          disabled={pendiente || cantidad <= 1}
          onClick={() => fijarCantidad(varianteId, cantidad - 1)}
        >
          −
        </button>
        <span className="min-w-6 text-center text-sm" aria-live="polite">
          {cantidad}
        </span>
        <button
          type="button"
          className="grid h-9 w-9 place-items-center disabled:text-negro/60"
          aria-label={`Agregar un par de ${nombre}`}
          disabled={pendiente || cantidad >= max}
          onClick={() => fijarCantidad(varianteId, cantidad + 1)}
        >
          +
        </button>
      </div>
      <button
        type="button"
        className="ml-auto px-2 text-lg leading-none"
        aria-label={`Quitar ${nombre} del carrito`}
        disabled={pendiente}
        onClick={() => fijarCantidad(varianteId, 0)}
      >
        ×
      </button>
    </div>
  );
}

/** Panel del carrito. Sin JavaScript, el ícono del header sigue llevando a /carrito. */
export function CarritoLateral() {
  const { carrito, abierto, agregadoId, cerrar } = useCarrito();
  const progreso = Math.min(100, (carrito.subtotal / tienda.envioGratisDesde) * 100);
  const lineas = [...carrito.lineas].sort((a, b) => Number(b.varianteId === agregadoId) - Number(a.varianteId === agregadoId));
  const vacio = lineas.length === 0;

  return (
    <PanelLateral
      abierto={abierto}
      onCerrar={cerrar}
      tituloId="titulo-carrito-lateral"
      titulo="Carrito"
      pie={
        vacio ? undefined : (
          <div>
            {carrito.faltaParaEnvioGratis > 0 ? (
              <p className="text-sm">
                Te faltan <strong>{formatPrecio(carrito.faltaParaEnvioGratis)}</strong> para el envío gratis.
              </p>
            ) : (
              <p className="text-sm font-semibold">Tu envío es gratis.</p>
            )}
            <div className="mt-2 h-1 bg-negro/15" role="presentation">
              <div className="h-full bg-pizarra transition-all" style={{ width: `${progreso}%` }} />
            </div>
            <dl className="mt-5 space-y-2 text-[0.9375rem]">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatPrecio(carrito.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Envío</dt>
                <dd>{carrito.envio === 0 ? "Gratis" : formatPrecio(carrito.envio)}</dd>
              </div>
              <div className="text-sm text-negro/70">IVA incluido</div>
              <div className="flex justify-between pt-1 text-lg font-semibold">
                <dt>Total</dt>
                <dd>{formatPrecio(carrito.total)}</dd>
              </div>
            </dl>
            <Link href="/checkout" className="btn-primario mt-5 w-full">
              Ir a pagar
            </Link>
            <Link href="/carrito" className="btn-contorno mt-3 w-full">
              Ver carrito
            </Link>
          </div>
        )
      }
    >
      {vacio ? (
        <div className="py-10">
          <p>Tu carrito está vacío.</p>
          <p className="mt-2 text-sm text-negro/75">Encuentra el par que te va a acompañar muchos años.</p>
          <div className="mt-6 flex gap-3">
            <Link href="/hombre" className="btn-contorno">
              Hombre
            </Link>
            <Link href="/mujer" className="btn-contorno">
              Mujer
            </Link>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-negro/10">
          {lineas.map((l) => {
            const max = Math.min(tienda.maxParesPorLinea, Math.max(l.disponibles, 0));
            return (
              <li key={l.varianteId} className="flex gap-4 py-5">
                <FotoProducto imagen={l.imagen} colorZapato={l.colorHex} sizes="96px" className="aspect-[4/5] w-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-3">
                    <p className="font-medium">{l.nombre}</p>
                    <p>{formatPrecio(l.precioUnitario * l.cantidad)}</p>
                  </div>
                  <p className="mt-1 text-sm text-negro/80">
                    {l.color} · Talla {formatTalla(l.talla)}
                  </p>
                  {l.cantidad > l.disponibles && (
                    <p className="mt-1 text-sm text-pizarra-oscuro">Ajusta la cantidad: no hay suficientes pares.</p>
                  )}
                  <Controles varianteId={l.varianteId} cantidad={l.cantidad} max={Math.max(max, 1)} nombre={l.nombre} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <NoOlvidesAgregar productos={[]} />
    </PanelLateral>
  );
}
