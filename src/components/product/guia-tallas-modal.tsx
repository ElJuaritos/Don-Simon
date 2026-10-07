"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { PanelLateral } from "@/components/ui/panel-lateral";
import { TablaTallas, type PublicoTalla } from "./tabla-tallas";

/** Guía de tallas en panel lateral: equivalencias, cómo medir y la horma del modelo. */
export function GuiaTallasPanel({
  publico,
  horma,
  recomendacion,
}: {
  publico: PublicoTalla;
  horma?: string | null;
  recomendacion?: string | null;
}) {
  const [abierto, setAbierto] = useState(false);
  const cerrar = useCallback(() => setAbierto(false), []);

  return (
    <>
      <button type="button" onClick={() => setAbierto(true)} className="enlace text-sm">
        Abrir guía de tallas
      </button>
      <PanelLateral abierto={abierto} onCerrar={cerrar} tituloId="titulo-guia-tallas" titulo="Guía de tallas">
        <div className="space-y-6 py-6 text-[0.9375rem]">
          <section>
            <h3 className="font-medium">Cómo medir tu pie</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Hazlo por la tarde, cuando el pie está un poco más hinchado.</li>
              <li>Pon una hoja en el piso, pegada a la pared, y apoya el talón.</li>
              <li>Marca la punta del dedo más largo y mide en centímetros.</li>
              <li>Mide ambos pies y quédate con el más grande.</li>
            </ul>
            <p className="mt-2 text-sm text-cafe/80">Esa medida en centímetros es tu talla MX.</p>
          </section>

          <TablaTallas publico={publico} />

          <p className="text-sm text-cafe/75">
            Equivalencias de referencia. Si estás entre dos tallas, sigue la recomendación de la horma.
          </p>

          {(horma || recomendacion) && (
            <section>
              <h3 className="font-medium">Horma de este modelo</h3>
              {horma && <p className="mt-2">{horma}</p>}
              {recomendacion && <p className="mt-1">{recomendacion}</p>}
              <Link href="/nuestras-hormas" className="enlace mt-3 inline-block text-sm">
                Nuestras hormas
              </Link>
            </section>
          )}
        </div>
      </PanelLateral>
    </>
  );
}
