"use client";

import { useActionState, type ReactNode } from "react";
import type { EstadoForm } from "@/lib/actions/tienda";

type Accion = (prev: EstadoForm, formData: FormData) => Promise<EstadoForm>;

/** Formulario del admin con mensajes de éxito/error y botón con estado de carga. */
export function FormAdmin({
  action,
  children,
  boton,
  className = "",
  botonClase = "btn-primario",
}: {
  action: Accion;
  children: ReactNode;
  boton: string;
  className?: string;
  botonClase?: string;
}) {
  const [estado, accion, enviando] = useActionState(action, undefined);
  return (
    <form action={accion} className={className}>
      {children}
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="submit" disabled={enviando} className={botonClase}>
          {enviando ? "Guardando…" : boton}
        </button>
        <p aria-live="polite" className="text-sm">
          {estado?.error && <span className="font-semibold text-terracota-oscuro">{estado.error}</span>}
          {estado?.ok && <span className="font-semibold text-olivo-oscuro">✓ {estado.mensaje}</span>}
        </p>
      </div>
    </form>
  );
}
