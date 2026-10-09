"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { tienda } from "@/config/marca";
import { agregarAlCarrito, type EstadoAgregar } from "@/lib/actions/tienda";
import { formatPrecio, etiquetaDeTalla } from "@/lib/formato";
import { useCarrito } from "@/components/cart/proveedor-carrito";
import { etiquetaTalla, type PublicoTalla, type SistemaTalla } from "./tabla-tallas";

export type OpcionTalla = { varianteId: string; talla: number | null; etiquetaTalla: string | null; disponibles: number };

const CLAVE = "ds-sistema-talla";
const SISTEMAS: { id: SistemaTalla; etiqueta: string }[] = [
  { id: "mx", etiqueta: "MX" },
  { id: "us", etiqueta: "US" },
  { id: "eu", etiqueta: "EU" },
];

function leerSistema(): SistemaTalla {
  try {
    const g = localStorage.getItem(CLAVE);
    if (g === "us" || g === "eu" || g === "mx") return g;
  } catch {
    /* modo privado o almacenamiento bloqueado */
  }
  return "mx";
}

function suscribirSistema(aviso: () => void) {
  window.addEventListener("ds-sistema-talla", aviso);
  window.addEventListener("storage", aviso);
  return () => {
    window.removeEventListener("ds-sistema-talla", aviso);
    window.removeEventListener("storage", aviso);
  };
}

/** MX por defecto. La elección se recuerda en este navegador y solo cambia la etiqueta. */
function useSistemaTalla() {
  const sistema = useSyncExternalStore(suscribirSistema, leerSistema, () => "mx" as SistemaTalla);
  function cambiar(s: SistemaTalla) {
    try {
      localStorage.setItem(CLAVE, s);
    } catch {
      /* si no se puede guardar, la elección vive solo en esta vista */
    }
    window.dispatchEvent(new Event("ds-sistema-talla"));
  }
  return [sistema, cambiar] as const;
}

export function SelectorCompra({ tallas, publico }: { tallas: OpcionTalla[]; publico: PublicoTalla }) {
  const [estado, accion, enviando] = useActionState(agregarAlCarrito, undefined);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const [sistema, setSistema] = useSistemaTalla();
  const { abrir } = useCarrito();
  const visto = useRef<EstadoAgregar>(undefined);
  const agregarRef = useRef<HTMLButtonElement>(null);
  const hayStock = tallas.some((t) => t.disponibles > 0);
  const elegida = tallas.find((t) => t.varianteId === seleccion);
  const accesorio = tallas.length > 0 && tallas.every((t) => t.talla == null);
  const unica = accesorio && tallas.length === 1 && etiquetaDeTalla(tallas[0]) === "Talla única";

  useEffect(() => {
    if (!estado?.ok || !estado.carrito || estado === visto.current) return;
    visto.current = estado;
    abrir({ carrito: estado.carrito, agregadoId: estado.agregadoId, desde: agregarRef.current });
  }, [estado, abrir]);

  function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    if (unica || seleccion) return;
    e.preventDefault();
    setAviso("Elige una talla para continuar.");
  }

  const pieza = accesorio ? "pieza" : "par";

  return (
    <form action={accion} onSubmit={alEnviar} className="mt-8">
      {unica ? (
        <input type="hidden" name="varianteId" value={tallas[0].varianteId} />
      ) : (
        <>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p id="etiqueta-tallas" className="text-sm font-medium">
              Talla
            </p>
            {!accesorio && (
              <div className="flex border border-negro/20 text-xs" role="group" aria-label="Sistema de tallas">
                {SISTEMAS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={sistema === s.id}
                    onClick={() => setSistema(s.id)}
                    className={`px-2.5 py-1 ${sistema === s.id ? "bg-negro text-blanco" : "hover:bg-niebla"}`}
                  >
                    {s.etiqueta}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div role="radiogroup" aria-labelledby="etiqueta-tallas" aria-describedby={aviso ? "aviso-talla" : undefined} className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {tallas.map((t) => {
              const agotada = t.disponibles === 0;
              const marcada = seleccion === t.varianteId;
              return (
                <label
                  key={t.varianteId}
                  className={`relative grid h-11 cursor-pointer place-items-center border px-1 text-center text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pizarra ${
                    agotada
                      ? "cursor-not-allowed border-negro/10 text-negro/60 line-through"
                      : marcada
                        ? "border-negro bg-negro text-blanco"
                        : "border-negro/25 hover:border-negro"
                  }`}
                >
                  <input
                    type="radio"
                    name="varianteId"
                    value={t.varianteId}
                    disabled={agotada}
                    className="sr-only"
                    checked={marcada}
                    onChange={() => {
                      setSeleccion(t.varianteId);
                      setAviso("");
                    }}
                  />
                  {accesorio ? etiquetaDeTalla(t) : etiquetaTalla(t.talla, sistema, publico)}
                  {agotada && <span className="sr-only">, agotada</span>}
                </label>
              );
            })}
          </div>
        </>
      )}

      <p id="aviso-talla" className="mt-2 min-h-5 text-sm text-pizarra-oscuro" role="alert">
        {aviso || estado?.error || ""}
      </p>
      {(unica ? tallas[0] : elegida) && (unica ? tallas[0] : elegida)!.disponibles > 0 && (unica ? tallas[0] : elegida)!.disponibles <= 2 && (
        <p className="text-sm text-pizarra-oscuro">
          {(unica ? tallas[0] : elegida)!.disponibles === 1 ? `Queda 1 ${pieza}.` : `Quedan ${(unica ? tallas[0] : elegida)!.disponibles} ${pieza === "par" ? "pares" : "piezas"}.`}
        </p>
      )}

      <div className="mt-4 grid gap-3">
        <button ref={agregarRef} type="submit" name="destino" value="carrito" disabled={!hayStock || enviando} className="btn-primario w-full">
          {!hayStock ? "Agotado" : enviando ? "Agregando…" : "Agregar al carrito"}
        </button>
        <button type="submit" name="destino" value="checkout" disabled={!hayStock || enviando} className="btn-contorno w-full">
          Comprar ahora
        </button>
      </div>
      <p className="mt-3 text-center text-sm text-negro/75">
        Envío gratis a todo México desde {formatPrecio(tienda.envioGratisDesde)}.
      </p>
    </form>
  );
}
