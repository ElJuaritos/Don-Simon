"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { tienda } from "@/config/marca";
import { agregarAlCarrito, type EstadoAgregar } from "@/lib/actions/tienda";
import { formatPrecio } from "@/lib/formato";
import { useCarrito } from "@/components/cart/proveedor-carrito";
import { etiquetaTalla, type PublicoTalla, type SistemaTalla } from "./tabla-tallas";

export type OpcionTalla = { varianteId: string; talla: number; disponibles: number };

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

  useEffect(() => {
    if (!estado?.ok || !estado.carrito || estado === visto.current) return;
    visto.current = estado;
    abrir({ carrito: estado.carrito, agregadoId: estado.agregadoId, desde: agregarRef.current });
  }, [estado, abrir]);

  function alEnviar(e: React.FormEvent<HTMLFormElement>) {
    if (seleccion) return;
    e.preventDefault();
    setAviso("Elige una talla para continuar.");
  }

  return (
    <form action={accion} onSubmit={alEnviar} className="mt-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p id="etiqueta-tallas" className="text-sm font-medium">
          Talla
        </p>
        <div className="flex border border-cafe/20 text-xs" role="group" aria-label="Sistema de tallas">
          {SISTEMAS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={sistema === s.id}
              onClick={() => setSistema(s.id)}
              className={`px-2.5 py-1 ${sistema === s.id ? "bg-cafe text-crema-claro" : "hover:bg-arena"}`}
            >
              {s.etiqueta}
            </button>
          ))}
        </div>
      </div>

      <div role="radiogroup" aria-labelledby="etiqueta-tallas" aria-describedby={aviso ? "aviso-talla" : undefined} className="grid grid-cols-5 gap-2">
        {tallas.map((t) => {
          const agotada = t.disponibles === 0;
          const marcada = seleccion === t.varianteId;
          return (
            <label
              key={t.varianteId}
              className={`relative grid h-11 cursor-pointer place-items-center border text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-terracota ${
                agotada
                  ? "cursor-not-allowed border-cafe/10 text-cafe/35 line-through"
                  : marcada
                    ? "border-cafe bg-cafe text-crema-claro"
                    : "border-cafe/25 hover:border-cafe"
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
              {etiquetaTalla(t.talla, sistema, publico)}
              {agotada && <span className="sr-only">, agotada</span>}
            </label>
          );
        })}
      </div>

      <p id="aviso-talla" className="mt-2 min-h-5 text-sm text-terracota-oscuro" role="alert">
        {aviso || estado?.error || ""}
      </p>
      {elegida && elegida.disponibles > 0 && elegida.disponibles <= 2 && (
        <p className="text-sm text-terracota-oscuro">
          {elegida.disponibles === 1 ? "Queda 1 par." : `Quedan ${elegida.disponibles} pares.`}
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
      <p className="mt-3 text-center text-sm text-cafe/75">
        Envío gratis a todo México desde {formatPrecio(tienda.envioGratisDesde)}.
      </p>
    </form>
  );
}
