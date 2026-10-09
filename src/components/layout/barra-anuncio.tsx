"use client";

import { useEffect, useState } from "react";

/** Franja de avisos. Con varios textos, rotan cada 5 s salvo que el sistema pida menos movimiento. */
export function BarraAnuncio({ mensajes }: { mensajes: string[] }) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [reducido, setReducido] = useState(false);
  const varios = mensajes.length > 1;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => setReducido(mq.matches);
    aplicar();
    mq.addEventListener("change", aplicar);
    return () => mq.removeEventListener("change", aplicar);
  }, []);

  useEffect(() => {
    if (!varios || pausado || reducido) return;
    const id = window.setInterval(() => setIndice((n) => (n + 1) % mensajes.length), 5000);
    return () => window.clearInterval(id);
  }, [varios, pausado, reducido, mensajes.length]);

  if (mensajes.length === 0) return null;
  const actual = mensajes[indice] ?? mensajes[0];

  return (
    <div className="foco-claro bg-pizarra text-blanco">
      <div className={`relative px-3 py-2 sm:px-4 lg:py-1.5 ${varios ? "pr-16 sm:pr-4" : ""}`}>
        <p
          className={`text-center text-[0.75rem] leading-none font-medium whitespace-nowrap sm:text-[0.8125rem] sm:whitespace-normal lg:leading-none ${varios ? "sm:px-14" : ""}`}
          aria-live="polite"
        >
          {actual}
        </p>
        {varios && (
          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-2">
            {reducido && (
              <button
                type="button"
                className="texto-nav min-h-11 px-2 underline-offset-2 hover:underline"
                onClick={() => setIndice((n) => (n + 1) % mensajes.length)}
              >
                Siguiente
              </button>
            )}
            {!reducido && (
              <button
                type="button"
                className="texto-nav min-h-11 px-2 underline-offset-2 hover:underline"
                aria-pressed={pausado}
                onClick={() => setPausado((p) => !p)}
              >
                {pausado ? "Seguir" : "Pausa"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
