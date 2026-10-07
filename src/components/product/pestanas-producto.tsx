"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";

export type PestanaProducto = {
  id: string;
  titulo: string;
  texto: string;
  enlace?: { href: string; texto: string };
};

function Cuerpo({ pestana }: { pestana: PestanaProducto }) {
  return (
    <>
      <p>{pestana.texto}</p>
      {pestana.enlace && (
        <Link href={pestana.enlace.href} className="enlace mt-3 inline-block text-sm">
          {pestana.enlace.texto}
        </Link>
      )}
    </>
  );
}

/**
 * En escritorio, pestañas (flechas, Inicio y Fin). En el celular, acordeón.
 * El padre omite las pestañas que no tienen texto.
 */
export function PestanasProducto({ pestanas }: { pestanas: PestanaProducto[] }) {
  const [activa, setActiva] = useState(pestanas[0]?.id ?? "");
  if (pestanas.length === 0) return null;

  function mover(desde: string, tecla: string) {
    const i = pestanas.findIndex((p) => p.id === desde);
    if (i < 0) return;
    let siguiente = i;
    if (tecla === "Home") siguiente = 0;
    else if (tecla === "End") siguiente = pestanas.length - 1;
    else if (tecla === "ArrowRight" || tecla === "ArrowDown") siguiente = (i + 1) % pestanas.length;
    else if (tecla === "ArrowLeft" || tecla === "ArrowUp") siguiente = (i - 1 + pestanas.length) % pestanas.length;
    else return;
    const id = pestanas[siguiente].id;
    setActiva(id);
    document.getElementById(`tab-${id}`)?.focus();
    document.getElementById(`acordeon-${id}`)?.focus();
  }

  function onTecla(e: KeyboardEvent<HTMLButtonElement>, id: string) {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    e.preventDefault();
    mover(id, e.key);
  }

  return (
    <div className="mt-8">
      <div className="lg:hidden divide-y divide-cafe/15 border-y border-cafe/15">
        {pestanas.map((p) => {
          const abierta = activa === p.id;
          return (
            <div key={p.id}>
              <button
                type="button"
                id={`acordeon-${p.id}`}
                className="flex w-full items-center justify-between py-4 text-left font-medium"
                aria-expanded={abierta}
                onClick={() => setActiva(abierta ? "" : p.id)}
                onKeyDown={(e) => onTecla(e, p.id)}
              >
                {p.titulo}
                <span aria-hidden className="text-lg">
                  {abierta ? "–" : "+"}
                </span>
              </button>
              {abierta && (
                <div className="pb-4 text-[0.9375rem]">
                  <Cuerpo pestana={p} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block">
        <div role="tablist" aria-label="Información del modelo" className="flex border-b border-cafe/15">
          {pestanas.map((p) => {
            const es = activa === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                id={`tab-${p.id}`}
                aria-selected={es}
                aria-controls={`panel-${p.id}`}
                tabIndex={es ? 0 : -1}
                onClick={() => setActiva(p.id)}
                onKeyDown={(e) => onTecla(e, p.id)}
                className={`-mb-px border-b-2 px-4 py-3 text-sm ${es ? "border-cafe font-semibold" : "border-transparent text-cafe/70 hover:text-cafe"}`}
              >
                {p.titulo}
              </button>
            );
          })}
        </div>
        {pestanas.map((p) => (
          <div
            key={p.id}
            role="tabpanel"
            id={`panel-${p.id}`}
            aria-labelledby={`tab-${p.id}`}
            hidden={activa !== p.id}
            tabIndex={0}
            className="py-5 text-[0.9375rem] focus-visible:outline-2 focus-visible:outline-terracota"
          >
            <Cuerpo pestana={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
