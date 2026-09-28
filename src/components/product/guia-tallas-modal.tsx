"use client";

import { useRef } from "react";
import { IconoCerrar } from "@/components/ui/iconos";
import { TablaTallas } from "./tabla-tallas";

export function GuiaTallasModal({ recomendacion }: { recomendacion?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()} className="enlace text-sm">
        Guía de tallas
      </button>
      <dialog
        ref={ref}
        aria-labelledby="titulo-guia"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto w-[min(40rem,calc(100%-2rem))] bg-hueso p-0 text-cafe backdrop:bg-cafe-oscuro/50"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id="titulo-guia" className="titulo-display text-3xl">
              Guía de tallas
            </h2>
            <button type="button" onClick={() => ref.current?.close()} aria-label="Cerrar" className="-mr-2 p-2">
              <IconoCerrar />
            </button>
          </div>
          {recomendacion && (
            <p className="mt-3 bg-arena px-4 py-3 text-sm">
              <strong>Para este modelo:</strong> {recomendacion}
            </p>
          )}
          <TablaTallas className="mt-5" />
          <p className="mt-4 text-sm">
            ¿Cómo medir? Pon tu pie sobre una hoja, marca el talón y la punta del dedo más largo y mide en
            centímetros. Esa medida es tu talla MX.
          </p>
        </div>
      </dialog>
    </>
  );
}
