"use client";

import { useActionState, useState } from "react";
import { enviarDevolucion, type EstadoDevolucion } from "@/lib/actions/soporte";
import { MOTIVOS_DEVOLUCION } from "@/lib/soporte";

/** Pide folio y correo; si coinciden con un pedido enviado o entregado, pide el par y el motivo. */
export function FormDevolucion() {
  const [estado, accion, enviando] = useActionState(enviarDevolucion, undefined as EstadoDevolucion | undefined);
  const [motivo, setMotivo] = useState("cambio_talla");
  const listo = Boolean(estado?.lineas && estado.folio && estado.email && !estado.mensaje);

  if (estado?.mensaje) {
    return (
      <div className="bg-niebla p-8" role="status">
        <p className="titulo-display text-3xl">{estado.mensaje}</p>
      </div>
    );
  }

  return (
    <form action={accion} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="dev-folio" className="campo-label">
            Folio del pedido
          </label>
          <input id="dev-folio" name="folio" required defaultValue={estado?.folio} className="campo" placeholder="DS-10034" />
        </div>
        <div>
          <label htmlFor="dev-email" className="campo-label">
            Correo de la compra
          </label>
          <input id="dev-email" name="email" type="email" required defaultValue={estado?.email} autoComplete="email" className="campo" />
        </div>
      </div>

      {listo && (
        <>
          <input type="hidden" name="paso" value="enviar" />
          <div>
            <label htmlFor="dev-par" className="campo-label">
              El par
            </label>
            <select id="dev-par" name="par" required className="campo" defaultValue="">
              <option value="" disabled>
                Elige un modelo
              </option>
              {estado?.lineas?.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dev-motivo" className="campo-label">
              Motivo
            </label>
            <select id="dev-motivo" name="motivo" className="campo" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
              {MOTIVOS_DEVOLUCION.map((m) => (
                <option key={m.valor} value={m.valor}>
                  {m.texto}
                </option>
              ))}
            </select>
          </div>
          {motivo === "cambio_talla" && (
            <div>
              <label htmlFor="dev-talla" className="campo-label">
                Talla que quieres
              </label>
              <input id="dev-talla" name="tallaDeseada" required className="campo max-w-40" placeholder="26" />
            </div>
          )}
          <div>
            <label htmlFor="dev-comentarios" className="campo-label">
              Comentarios (opcional)
            </label>
            <textarea id="dev-comentarios" name="comentarios" rows={4} className="campo" />
          </div>
        </>
      )}

      {estado?.error && (
        <p role="alert" className="text-pizarra-oscuro">
          {estado.error}
        </p>
      )}
      <button type="submit" disabled={enviando} className="btn-primario">
        {enviando ? "Enviando…" : listo ? "Enviar solicitud" : "Continuar"}
      </button>
    </form>
  );
}
