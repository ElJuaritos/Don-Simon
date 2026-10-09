"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { IconoCerrar } from "@/components/ui/iconos";

function focables(panel: HTMLElement) {
  return [...panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])")].filter(
    (el) => !el.closest("[inert]"),
  );
}

function atrapar(e: KeyboardEvent, panel: HTMLElement) {
  const lista = focables(panel);
  if (lista.length === 0) return;
  const primero = lista[0];
  const ultimo = lista[lista.length - 1];
  const activo = document.activeElement;
  if (e.shiftKey && activo === primero) {
    e.preventDefault();
    ultimo.focus();
  } else if (!e.shiftKey && activo === ultimo) {
    e.preventDefault();
    primero.focus();
  }
}

/**
 * Panel que entra por la derecha. Atrapa el foco, se cierra con Escape
 * y devuelve el foco al elemento que lo abrió.
 */
export function PanelLateral({
  abierto,
  onCerrar,
  tituloId,
  titulo,
  children,
  pie,
}: {
  abierto: boolean;
  onCerrar: () => void;
  tituloId: string;
  titulo: ReactNode;
  children: ReactNode;
  pie?: ReactNode;
}) {
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const anterior = document.activeElement as HTMLElement | null;
    cerrarRef.current?.focus();
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCerrar();
        return;
      }
      if (e.key === "Tab" && panelRef.current) atrapar(e, panelRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener("keydown", onKey);
      anterior?.focus();
    };
  }, [abierto, onCerrar]);

  return (
    <div className={`fixed inset-0 z-50 ${abierto ? "" : "pointer-events-none"}`} aria-hidden={!abierto}>
      <div className={`absolute inset-0 bg-negro/40 transition-opacity duration-300 ${abierto ? "opacity-100" : "opacity-0"}`} onClick={onCerrar} />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        inert={!abierto}
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-blanco shadow-xl transition-transform duration-500 ease-suave ${abierto ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-negro/10 px-6 py-5">
          <h2 id={tituloId} className="font-sans text-lg font-medium">
            {titulo}
          </h2>
          <button ref={cerrarRef} type="button" onClick={onCerrar} aria-label="Cerrar" className="-mr-2 p-2">
            <IconoCerrar />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6">{children}</div>
        {pie && <div className="border-t border-negro/10 bg-niebla px-6 py-6">{pie}</div>}
      </aside>
    </div>
  );
}
