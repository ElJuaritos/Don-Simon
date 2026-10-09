"use client";

import { useActionState } from "react";
import { rastrearPedido, type EstadoRastreo } from "@/lib/actions/soporte";
import { PASOS_RASTREO } from "@/lib/soporte";

/** Formulario de rastreo. Si coincide, muestra solo folio, estado, guía y modelos. */
export function FormRastrear() {
  const [estado, accion, enviando] = useActionState(rastrearPedido, undefined as EstadoRastreo | undefined);
  const pedido = estado?.pedido;

  return (
    <div className="space-y-10">
      <form action={accion} className="space-y-5">
        <div>
          <label htmlFor="folio" className="campo-label">
            Folio del pedido
          </label>
          <input id="folio" name="folio" required autoComplete="off" className="campo" placeholder="DS-10034" />
        </div>
        <div>
          <label htmlFor="email" className="campo-label">
            Correo de la compra
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className="campo" />
        </div>
        {estado?.error && (
          <p role="alert" className="text-pizarra-oscuro">
            {estado.error}
          </p>
        )}
        <button type="submit" disabled={enviando} className="btn-primario">
          {enviando ? "Buscando…" : "Rastrear"}
        </button>
      </form>

      {pedido && (
        <section aria-live="polite" className="border border-negro/15 p-6">
          <p className="etiqueta text-negro/85">{pedido.folio}</p>
          <h2 className="titulo-display mt-3 text-4xl">{pedido.estado}</h2>
          <p className="mt-2 text-sm text-negro/85">{pedido.fecha}</p>

          {pedido.avance >= 0 && (
            <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PASOS_RASTREO.map((paso, i) => (
                <li
                  key={paso.estado}
                  className={`border-t-2 pt-2 text-sm ${i <= pedido.avance ? "border-negro" : "border-topo"}`}
                >
                  <span className={i <= pedido.avance ? "font-semibold" : "text-negro/70"}>{paso.texto}</span>
                </li>
              ))}
            </ol>
          )}

          {(pedido.paqueteria || pedido.numeroGuia) && (
            <p className="mt-6">
              {pedido.paqueteria}
              {pedido.paqueteria && pedido.numeroGuia ? " · " : ""}
              {pedido.numeroGuia && <span>Guía {pedido.numeroGuia}</span>}
            </p>
          )}

          <ul className="mt-6 space-y-2">
            {pedido.lineas.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
