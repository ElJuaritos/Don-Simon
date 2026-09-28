"use client";

import { useActionState } from "react";
import { enviarMensaje } from "@/lib/actions/tienda";

export function FormContacto() {
  const [estado, accion, enviando] = useActionState(enviarMensaje, undefined);

  if (estado?.ok) {
    return (
      <div className="flex items-center bg-arena p-8" role="status">
        <p className="titulo-display text-3xl">{estado.mensaje}</p>
      </div>
    );
  }

  return (
    <form action={accion} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-nombre" className="campo-label">Nombre</label>
          <input id="c-nombre" name="nombre" required autoComplete="name" className="campo" />
        </div>
        <div>
          <label htmlFor="c-tel" className="campo-label">Teléfono (opcional)</label>
          <input id="c-tel" name="telefono" type="tel" autoComplete="tel" className="campo" />
        </div>
      </div>
      <div>
        <label htmlFor="c-email" className="campo-label">Correo electrónico</label>
        <input id="c-email" name="email" type="email" required autoComplete="email" className="campo" />
      </div>
      <div>
        <label htmlFor="c-mensaje" className="campo-label">Mensaje</label>
        <textarea id="c-mensaje" name="mensaje" rows={6} required minLength={10} className="campo" />
      </div>
      {estado?.error && (
        <p role="alert" className="text-terracota-oscuro">
          {estado.error}
        </p>
      )}
      <button type="submit" disabled={enviando} className="btn-primario">
        {enviando ? "Enviando…" : "Enviar mensaje"}
      </button>
    </form>
  );
}
