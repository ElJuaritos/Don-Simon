"use client";

import { useRef, useState } from "react";
import { FotoPendiente, FotoProducto } from "@/components/ui/foto";

const ANGULOS = ["lateral", "vista 3/4", "detalle de costura", "suela"];

/** Escritorio: rejilla de 2 columnas. Móvil: carrusel con scroll-snap y contador. */
export function GaleriaProducto({
  imagenes,
  colorHex,
}: {
  imagenes: { url: string; alt: string }[];
  colorHex?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [indice, setIndice] = useState(0);
  const total = imagenes.length > 0 ? imagenes.length : ANGULOS.length;

  function alDeslizar() {
    const el = scroller.current;
    if (!el || el.clientWidth === 0) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setIndice(Math.min(total - 1, Math.max(0, i)));
  }

  return (
    <div>
      <div
        ref={scroller}
        onScroll={alDeslizar}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto lg:grid lg:grid-cols-2 lg:overflow-visible"
      >
        {imagenes.length > 0
          ? imagenes.map((img, i) => (
              <FotoProducto
                key={img.url + i}
                imagen={img}
                prioridad={i === 0}
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="aspect-[4/5] w-full shrink-0 snap-center lg:w-auto"
              />
            ))
          : ANGULOS.map((angulo, i) => (
              <FotoPendiente
                key={angulo}
                tono="claro"
                colorZapato={i === 0 ? colorHex : undefined}
                nota={angulo}
                className="aspect-[4/5] w-full shrink-0 snap-center lg:w-auto"
              />
            ))}
      </div>
      <p className="mt-3 text-center text-sm text-negro/80 lg:hidden" aria-live="polite">
        {indice + 1} / {total}
      </p>
    </div>
  );
}
