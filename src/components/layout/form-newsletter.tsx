"use client";

import { useActionState } from "react";
import { suscribir } from "@/lib/actions/tienda";

/** Suscripción al newsletter: una línea con el correo y el botón. */
export function FormNewsletter({ origen = "footer" }: { origen?: string }) {
  const [estado, accion, enviando] = useActionState(suscribir, undefined);

  if (estado?.ok) {
    return <p className="font-medium">{estado.mensaje}</p>;
  }

  return (
    <form action={accion} className="w-full">
      <input type="hidden" name="origen" value={origen} />
      <label htmlFor={`email-${origen}`} className="sr-only">
        Correo electrónico
      </label>
      <div className="flex items-end gap-3 border-b border-cafe/40 focus-within:border-cafe">
        <input
          id={`email-${origen}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Tu correo electrónico"
          className="min-h-12 min-w-0 flex-1 bg-transparent text-base placeholder:text-cafe/60 focus:outline-none"
        />
        <button type="submit" disabled={enviando} className="etiqueta min-h-12 shrink-0 transition-opacity hover:opacity-60 disabled:opacity-40">
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
