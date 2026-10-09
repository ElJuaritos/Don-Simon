"use client";

import { useActionState } from "react";
import { enviarResena } from "@/lib/actions/resenas";
import { ETIQUETA_ANCHO, OPCIONES_AJUSTE } from "@/lib/resenas-texto";
import type { AnchoPie } from "@/db/schema";
import { SelectorEstrellas } from "@/components/resenas/selector-estrellas";

/** Formulario para quien recibió el enlace. El texto se envía tal cual, sin formato. */
export function FormResena({
  token,
  nombre,
  ciudad,
}: {
  token: string;
  nombre: string;
  ciudad: string;
}) {
  const [estado, accion, enviando] = useActionState(enviarResena, undefined);
  if (estado?.ok) {
    return (
      <p className="border border-negro/15 bg-niebla/50 p-6 text-lg" role="status">
        Gracias. Tu reseña se publicará cuando la revisemos.
      </p>
    );
  }

  return (
    <form action={accion} className="grid max-w-xl gap-5">
      <input type="hidden" name="token" value={token} />
      <SelectorEstrellas />
      <label className="block">
        <span className="campo-label">Título</span>
        <input name="titulo" required minLength={2} maxLength={120} className="campo" />
      </label>
      <label className="block">
        <span className="campo-label">Tu reseña</span>
        <textarea name="texto" required minLength={20} maxLength={2000} rows={5} className="campo" />
        <span className="mt-1 block text-xs text-negro/60">Entre 20 y 2,000 caracteres.</span>
      </label>

      <fieldset>
        <legend className="campo-label">¿Cómo te quedó?</legend>
        <div className="mt-2 grid gap-2">
          {OPCIONES_AJUSTE.map((o) => (
            <label key={o.valor} className="flex min-h-11 items-center gap-3 text-sm">
              <input type="radio" name="ajuste" value={o.valor} required className="accent-negro" />
              {o.etiqueta}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="campo-label">Ancho de tu pie</legend>
        <div className="mt-2 flex flex-wrap gap-4">
          {(Object.keys(ETIQUETA_ANCHO) as AnchoPie[]).map((a) => (
            <label key={a} className="flex min-h-11 items-center gap-2 text-sm">
              <input type="radio" name="anchoPie" value={a} required className="accent-negro" />
              {ETIQUETA_ANCHO[a]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="campo-label">Nombre que se muestra</span>
        <input name="nombre" required minLength={2} maxLength={80} defaultValue={nombre} className="campo" autoComplete="name" />
      </label>
      <label className="block">
        <span className="campo-label">Ciudad (opcional)</span>
        <input name="ciudad" maxLength={80} defaultValue={ciudad} className="campo" autoComplete="address-level2" />
      </label>

      {estado?.error && (
        <p role="alert" className="text-sm font-semibold text-pizarra-oscuro">
          {estado.error}
        </p>
      )}
      <button type="submit" disabled={enviando} className="btn-primario w-full sm:w-auto">
        {enviando ? "Enviando…" : "Enviar reseña"}
      </button>
    </form>
  );
}
