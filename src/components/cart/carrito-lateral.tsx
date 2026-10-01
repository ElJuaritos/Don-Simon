"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { tienda } from "@/config/marca";
import type { CarritoDetallado } from "@/lib/carrito";
import { formatPrecio, formatTalla } from "@/lib/formato";
import { FotoProducto } from "@/components/ui/foto";
import { IconoCerrar } from "@/components/ui/iconos";

/** Panel que se abre desde la derecha al agregar un par: confirma qué se agregó y lleva a pagar. */
export function CarritoLateral({
  carrito,
  agregadoId,
  abierto,
  onCerrar,
}: {
  carrito: CarritoDetallado;
  agregadoId?: string;
  abierto: boolean;
  onCerrar: () => void;
}) {
  const cerrarRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const anterior = document.activeElement as HTMLElement | null;
    cerrarRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      anterior?.focus();
    };
  }, [abierto, onCerrar]);

  // El par recién agregado va primero
  const lineas = [...carrito.lineas].sort((a, b) => Number(b.varianteId === agregadoId) - Number(a.varianteId === agregadoId));
  const progreso = Math.min(100, (carrito.subtotal / tienda.envioGratisDesde) * 100);

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${abierto ? "opacity-100" : "pointer-events-none opacity-0"}`}
      aria-hidden={!abierto}
    >
      <div className="absolute inset-0 bg-cafe-oscuro/40" onClick={onCerrar} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-carrito-lateral"
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-hueso shadow-xl transition-transform duration-500 ease-suave ${abierto ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-cafe/10 px-6 py-5">
          <h2 id="titulo-carrito-lateral" className="etiqueta">
            ✓ Agregado a tu carrito
          </h2>
          <button ref={cerrarRef} type="button" onClick={onCerrar} aria-label="Cerrar" className="-mr-2 p-2" tabIndex={abierto ? 0 : -1}>
            <IconoCerrar />
          </button>
        </div>

        <ul className="flex-1 divide-y divide-cafe/10 overflow-y-auto px-6">
          {lineas.map((l) => (
            <li key={l.varianteId} className="flex gap-4 py-5">
              <FotoProducto imagen={l.imagen} colorZapato={l.colorHex} sizes="96px" className="aspect-[4/5] w-20 shrink-0" />
              <div className="flex flex-1 flex-col text-[0.9375rem]">
                <div className="flex justify-between gap-3">
                  <p className="font-medium">{l.nombre}</p>
                  <p>{formatPrecio(l.precioUnitario * l.cantidad)}</p>
                </div>
                <p className="mt-1 text-sm text-cafe/85">
                  {l.color} · Talla {formatTalla(l.talla)}
                  {l.cantidad > 1 && ` · ${l.cantidad} pares`}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t border-cafe/10 bg-arena px-6 py-6">
          {carrito.faltaParaEnvioGratis > 0 ? (
            <p className="text-sm">
              Te faltan <strong>{formatPrecio(carrito.faltaParaEnvioGratis)}</strong> para el envío gratis.
            </p>
          ) : (
            <p className="text-sm font-semibold">¡Tu envío es gratis!</p>
          )}
          <div className="mt-2 h-1 bg-cafe/15" role="presentation">
            <div className="h-full bg-terracota transition-all" style={{ width: `${progreso}%` }} />
          </div>
          <div className="mt-5 flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>{formatPrecio(carrito.subtotal)}</span>
          </div>
          <Link href="/checkout" className="btn-primario mt-5 w-full" tabIndex={abierto ? 0 : -1}>
            Ir a pagar
          </Link>
          <div className="mt-4 flex justify-between text-sm">
            <Link href="/carrito" className="enlace" tabIndex={abierto ? 0 : -1}>
              Ver carrito
            </Link>
            <button type="button" onClick={onCerrar} className="enlace" tabIndex={abierto ? 0 : -1}>
              Seguir comprando
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
