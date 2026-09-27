"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { agregarAlCarrito } from "@/lib/actions/tienda";
import { formatTalla } from "@/lib/formato";

export type OpcionTalla = { varianteId: string; talla: number; disponibles: number };

export function SelectorCompra({ tallas }: { tallas: OpcionTalla[] }) {
  const [estado, accion, enviando] = useActionState(agregarAlCarrito, undefined);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const elegida = tallas.find((t) => t.varianteId === seleccion);
  const hayStock = tallas.some((t) => t.disponibles > 0);

  return (
    <form action={accion}>
      <fieldset>
        <legend className="etiqueta">
          Talla (MX){elegida && <span className="ml-2 normal-case tracking-normal">· {formatTalla(elegida.talla)}</span>}
        </legend>
        <div className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {tallas.map((t) => {
            const agotada = t.disponibles === 0;
            return (
              <label
                key={t.varianteId}
                className={`relative grid h-12 cursor-pointer place-items-center border text-sm font-semibold transition-colors has-[:checked]:border-cafe has-[:checked]:bg-cafe has-[:checked]:text-crema-claro has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-terracota ${
                  agotada
                    ? "cursor-not-allowed border-cafe/10 text-cafe/35 line-through"
                    : "border-cafe/25 hover:border-cafe"
                }`}
              >
                <input
                  type="radio"
                  name="varianteId"
                  value={t.varianteId}
                  disabled={agotada}
                  required
                  className="sr-only"
                  // Controlado para que la talla siga marcada después de agregar al carrito
                  checked={seleccion === t.varianteId}
                  onChange={() => setSeleccion(t.varianteId)}
                />
                {formatTalla(t.talla)}
                {agotada && <span className="sr-only"> (agotada)</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      <p className="mt-3 min-h-6 text-sm" aria-live="polite">
        {elegida && elegida.disponibles <= 2 && (
          <span className="text-terracota-oscuro">
            {elegida.disponibles === 1 ? "¡Queda 1 par!" : `Quedan ${elegida.disponibles} pares`}
          </span>
        )}
      </p>

      <button type="submit" disabled={!hayStock || enviando} className="btn-primario mt-2 w-full">
        {!hayStock ? "Agotado" : enviando ? "Agregando…" : "Agregar al carrito"}
      </button>

      <div aria-live="polite" className="mt-3 min-h-6 text-sm">
        {estado?.error && <p className="text-terracota-oscuro">{estado.error}</p>}
        {estado?.ok && (
          <p>
            ✓ {estado.mensaje}.{" "}
            <Link href="/carrito" className="enlace font-semibold">
              Ver carrito
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
