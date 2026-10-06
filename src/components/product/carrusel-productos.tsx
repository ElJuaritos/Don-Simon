"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Carrusel horizontal sin librerías. En escritorio, flechas que desplazan una tarjeta;
 * en el celular se desliza y se asoma la siguiente (~1.3 tarjetas).
 * Recibe cualquier lista de tarjetas: se reutiliza en la ficha y en el carrito.
 */
export function CarruselProductos({
  children,
  etiqueta = "Productos",
}: {
  children: ReactNode;
  etiqueta?: string;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const [borde, setBorde] = useState({ inicio: true, fin: false });
  const items = Children.toArray(children);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const medir = () => {
      setBorde({
        inicio: el.scrollLeft <= 2,
        fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      });
    };
    const frame = requestAnimationFrame(medir);
    el.addEventListener("scroll", medir, { passive: true });
    const observer = new ResizeObserver(medir);
    observer.observe(el);
    if (el.firstElementChild) observer.observe(el.firstElementChild);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", medir);
      observer.disconnect();
    };
  }, [items.length]);

  function mover(direccion: number) {
    const el = scroller.current;
    if (!el) return;
    const tarjeta = el.querySelector("li");
    const ancho = tarjeta?.getBoundingClientRect().width ?? el.clientWidth * 0.8;
    const delta = direccion * (ancho + 12);
    el.scrollBy({ left: delta, behavior: "auto" });
    setBorde({
      inicio: el.scrollLeft <= 2,
      fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }

  return (
    <div className="relative">
      <ul
        ref={scroller}
        aria-label={etiqueta}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 [scrollbar-width:none] sm:scroll-px-6 sm:px-6 lg:scroll-px-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <li key={(item as { key?: string | null }).key ?? String(items.indexOf(item))} className="w-[78vw] shrink-0 snap-start sm:w-[48vw] lg:w-[calc((100%-2.25rem)/4)]">
            {item}
          </li>
        ))}
      </ul>
      <Flecha direccion={-1} oculta={borde.inicio} onClick={() => mover(-1)} />
      <Flecha direccion={1} oculta={borde.fin} onClick={() => mover(1)} />
    </div>
  );
}

function Flecha({
  direccion,
  oculta,
  onClick,
}: {
  direccion: -1 | 1;
  oculta: boolean;
  onClick: () => void;
}) {
  if (oculta) return null;
  const izquierda = direccion === -1;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={izquierda ? "Ver anteriores" : "Ver siguientes"}
      className={`absolute top-1/3 z-10 hidden h-11 w-11 place-items-center border border-cafe/15 bg-hueso/95 text-cafe transition-opacity hover:bg-hueso focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cafe lg:grid ${izquierda ? "left-3" : "right-3"}`}
    >
      <span aria-hidden className="text-xl leading-none">
        {izquierda ? "‹" : "›"}
      </span>
    </button>
  );
}
