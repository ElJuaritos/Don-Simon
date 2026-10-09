"use client";

import { useActionState } from "react";
import { suscribir } from "@/lib/actions/tienda";

const OPCIONES = [
  { valor: "hombre", texto: "Hombre" },
  { valor: "mujer", texto: "Mujer" },
  { valor: "ambos", texto: "Ambos" },
] as const;

/** Suscripción al boletín, con la preferencia de qué quiere recibir. */
export function FormNewsletter({ origen = "footer" }: { origen?: string }) {
  const [estado, accion, enviando] = useActionState(suscribir, undefined);

  if (estado?.ok) {
    return <p className="font-medium">{estado.mensaje}</p>;
  }

  return (
    <form action={accion} className="w-full">
      <input type="hidden" name="origen" value={origen} />
      <fieldset>
        <legend className="mb-2 text-sm font-medium">¿Qué quieres recibir?</legend>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {OPCIONES.map((opcion) => (
            <label key={opcion.valor} className="inline-flex min-h-11 items-center gap-2 text-sm">
              <input
                type="radio"
                name="preferencia"
                value={opcion.valor}
                defaultChecked={opcion.valor === "ambos"}
                className="h-4 w-4 accent-blanco"
              />
              {opcion.texto}
            </label>
          ))}
        </div>
      </fieldset>
      <label htmlFor={`email-${origen}`} className="sr-only">
        Correo electrónico
      </label>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
        <input
          id={`email-${origen}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Tu correo electrónico"
          className="campo min-w-0 flex-1 bg-blanco text-negro"
        />
        <button type="submit" disabled={enviando} className="btn-claro shrink-0">
          {enviando ? "Enviando…" : "Suscribirme"}
        </button>
      </div>
      {estado?.error && (
        <p role="alert" className="mt-2 text-sm">
          {estado.error}
        </p>
      )}
    </form>
  );
}
