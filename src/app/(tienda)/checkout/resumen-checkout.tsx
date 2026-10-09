"use client";

import { useState } from "react";
import { tienda } from "@/config/marca";
import { formatPrecio, textoDeTalla } from "@/lib/formato";
import { useCarrito } from "@/components/cart/proveedor-carrito";

/** Resumen del pedido. En el celular empieza plegado; en escritorio se queda fijo. */
export function ResumenCheckout() {
  const { carrito, fijarCantidad, pendiente } = useCarrito();
  const [abierto, setAbierto] = useState(false);

  return (
    <aside className="h-fit bg-niebla p-5 lg:sticky lg:top-28 lg:order-2 lg:p-6" aria-labelledby="titulo-pedido">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left lg:hidden"
        aria-expanded={abierto}
        aria-controls="cuerpo-resumen"
        onClick={() => setAbierto((v) => !v)}
      >
        <span className="font-medium">{abierto ? "Ocultar resumen" : `Ver resumen · ${formatPrecio(carrito.total)}`}</span>
        <span aria-hidden>{abierto ? "–" : "+"}</span>
      </button>
      <h2 id="titulo-pedido" className="hidden font-medium lg:block">
        Tu pedido
      </h2>

      <div id="cuerpo-resumen" className={abierto ? "mt-4" : "mt-4 hidden lg:block"}>
        <ul className="space-y-4 text-[0.9375rem]">
          {carrito.lineas.map((l) => {
            const max = Math.min(tienda.maxParesPorLinea, Math.max(l.disponibles, l.cantidad));
            return (
              <li key={l.varianteId} className="flex justify-between gap-4">
                <div>
                  <p className="font-medium">{l.nombre}</p>
                  <p className="text-sm text-negro/75">
                    {l.color} · {textoDeTalla(l)}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex items-center border border-negro/25">
                      <button
                        type="button"
                        className="grid h-8 w-8 place-items-center disabled:text-negro/60"
                        aria-label={`Quitar un artículo de ${l.nombre}`}
                        disabled={pendiente || l.cantidad <= 1}
                        onClick={() => fijarCantidad(l.varianteId, l.cantidad - 1)}
                      >
                        −
                      </button>
                      <span className="min-w-5 text-center text-sm">{l.cantidad}</span>
                      <button
                        type="button"
                        className="grid h-8 w-8 place-items-center disabled:text-negro/60"
                        aria-label={`Agregar un artículo de ${l.nombre}`}
                        disabled={pendiente || l.cantidad >= max}
                        onClick={() => fijarCantidad(l.varianteId, l.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button type="button" className="enlace text-sm" disabled={pendiente} onClick={() => fijarCantidad(l.varianteId, 0)}>
                      Quitar
                    </button>
                  </div>
                </div>
                <p>{formatPrecio(l.precioUnitario * l.cantidad)}</p>
              </li>
            );
          })}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-negro/15 pt-4 text-[0.9375rem]">
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
      </div>
    </aside>
  );
}
