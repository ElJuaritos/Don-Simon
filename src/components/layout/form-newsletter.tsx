"use client";

import { useActionState } from "react";
import { suscribir } from "@/lib/actions/tienda";

export function FormNewsletter({ origen = "footer", oscuro = true }: { origen?: string; oscuro?: boolean }) {
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
      <div className={`flex flex-col gap-2 ${oscuro ? "md:max-lg:flex-row" : "sm:flex-row"}`}>
        <input
          id={`email-${origen}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Tu correo electrónico"
          className={
            oscuro
              ? "min-h-12 min-w-0 flex-1 rounded-[2px] border border-crema/40 bg-transparent px-4 text-crema-claro placeholder:text-crema/60 focus:border-crema focus:outline-none"
              : "campo min-w-0 flex-1"
          }
        />
        <button type="submit" disabled={enviando} className={oscuro ? "btn-claro" : "btn-primario"}>
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
