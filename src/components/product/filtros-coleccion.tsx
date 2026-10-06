"use client";

import { useEffect, useId, useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Orden } from "@/lib/data/catalogo";
import { ORDENES } from "./ordenes";

// Barra de filtros del catálogo. Cada desplegable es un <details>, así funciona sin JavaScript.
// Con JavaScript se aplican al elegir una casilla. En el celular se abren en un panel de pantalla completa.

export type OpcionFiltro = { valor: string; texto: string };

export function FormFiltros({
  rutaBase,
  para,
  orden,
  grupos,
  total,
  llave,
}: {
  rutaBase: string;
  para?: string;
  orden: Orden;
  grupos: { id: string; etiqueta: string; nombre: string; opciones: OpcionFiltro[]; activos: string[] }[];
  total: number;
  llave: string;
}) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [pendiente, startTransition] = useTransition();
  const cerrarRef = useRef<HTMLButtonElement>(null);
  const tituloId = useId();
  const activos = grupos.reduce((n, g) => n + g.activos.length, 0);

  useEffect(() => {
    if (!abierto) return;
    const antes = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cerrarRef.current?.focus();
    const angosto = window.matchMedia("(max-width: 1023px)").matches;
    if (angosto) document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      antes?.focus();
    };
  }, [abierto]);

  function aplicar(e: FormEvent<HTMLFormElement>) {
    const params = new URLSearchParams();
    for (const [k, v] of new FormData(e.currentTarget)) {
      if (!v || (k === "orden" && v === "destacados")) continue;
      params.append(k, String(v));
    }
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${rutaBase}?${qs}` : rutaBase, { scroll: false }));
  }

  const panel = `bg-hueso lg:static lg:z-auto lg:flex lg:flex-row lg:items-center lg:justify-between lg:overflow-visible lg:bg-transparent ${
    abierto ? "fixed inset-0 z-50 flex flex-col overflow-y-auto" : "hidden"
  }`;

  return (
    <div className="border-y border-cafe/15">
      <noscript>
        <style>{`.filtros-panel{display:flex !important;position:static !important;inset:auto !important;overflow:visible !important;}`}</style>
      </noscript>
      <div className="contenedor flex items-center justify-between py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-expanded={abierto}
          aria-controls="panel-filtros"
          className="texto-nav inline-flex min-h-11 items-center gap-2"
        >
          Filtrar y ordenar
          {activos > 0 && (
            <span className="grid h-5 min-w-5 place-items-center bg-cafe px-1 text-[0.6875rem] text-crema-claro">{activos}</span>
          )}
        </button>
        <Conteo total={total} cargando={pendiente} />
      </div>

      <form
        key={llave}
        method="get"
        action={rutaBase}
        id="panel-filtros"
        role={abierto ? "dialog" : undefined}
        aria-modal={abierto ? true : undefined}
        aria-labelledby={abierto ? tituloId : undefined}
        onChange={aplicar}
        onSubmit={(e) => {
          e.preventDefault();
          setAbierto(false);
        }}
        className={`filtros-panel ${panel}`}
      >
        <div className="flex items-center justify-between border-b border-cafe/15 px-4 py-3 lg:hidden">
          <p id={tituloId} className="text-lg font-medium">
            Filtrar y ordenar
          </p>
          <button ref={cerrarRef} type="button" onClick={() => setAbierto(false)} className="texto-nav min-h-11 px-2">
            Cerrar
          </button>
        </div>

        <div className="contenedor flex flex-1 flex-col lg:flex-none lg:flex-row lg:flex-wrap lg:items-center lg:gap-1 lg:px-10 lg:py-1">
          {para && <input type="hidden" name="para" value={para} />}
          {grupos.map((g) => (
            <Desplegable key={g.id} {...g} />
          ))}
          <div className="mt-2 border-t border-cafe/10 py-4 lg:mt-0 lg:ml-auto lg:flex lg:items-center lg:gap-6 lg:border-0 lg:py-0">
            <label className="texto-nav flex min-h-11 items-center gap-2">
              <span>Ordenar</span>
              <select name="orden" defaultValue={orden} className="bg-transparent py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cafe">
                {ORDENES.map((o) => (
                  <option key={o.valor} value={o.valor}>
                    {o.texto}
                  </option>
                ))}
              </select>
            </label>
            <div className="hidden lg:block">
              <Conteo total={total} cargando={pendiente} />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 border-t border-cafe/15 bg-hueso p-4 lg:hidden">
          <button type="submit" className="btn-primario w-full">
            Ver {total} {total === 1 ? "modelo" : "modelos"}
          </button>
        </div>
        <noscript>
          <button type="submit" className="btn-primario mx-4 mb-4 min-h-11 px-5 lg:mx-10">
            Aplicar
          </button>
        </noscript>
      </form>
    </div>
  );
}

function Desplegable({
  etiqueta,
  nombre,
  opciones,
  activos,
}: {
  id: string;
  etiqueta: string;
  nombre: string;
  opciones: OpcionFiltro[];
  activos: string[];
}) {
  const [abierto, setAbierto] = useState(false);
  const panelId = useId();
  if (opciones.length < 2 && activos.length === 0) return null;

  return (
    <details
      className="border-b border-cafe/10 lg:relative lg:border-0"
      onToggle={(e) => setAbierto(e.currentTarget.open)}
    >
      <summary
        aria-expanded={abierto}
        aria-controls={panelId}
        className="flex min-h-11 cursor-pointer list-none items-center gap-2 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cafe lg:px-3 [&::-webkit-details-marker]:hidden"
      >
        <span className="texto-nav">{etiqueta}</span>
        {activos.length > 0 && <span className="text-[0.75rem] text-cafe/70">{activos.length}</span>}
      </summary>
      <div id={panelId} className="flex flex-col gap-1 pb-3 lg:absolute lg:top-full lg:left-0 lg:z-20 lg:min-w-56 lg:border lg:border-cafe/15 lg:bg-hueso lg:p-3">
        {opciones.map((o) => (
          <label key={o.valor} className="flex min-h-11 cursor-pointer items-center gap-3 px-1 text-sm">
            <input
              type="checkbox"
              name={nombre}
              value={o.valor}
              defaultChecked={activos.includes(o.valor)}
              className="h-4 w-4 accent-cafe"
            />
            {o.texto}
          </label>
        ))}
      </div>
    </details>
  );
}

function Conteo({ total, cargando }: { total: number; cargando: boolean }) {
  return (
    <p className="texto-nav text-cafe/75" aria-live="polite">
      {cargando ? "Buscando…" : `${total} ${total === 1 ? "modelo" : "modelos"}`}
    </p>
  );
}

