"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import type { Orden } from "@/lib/data/catalogo";
import { formatTalla } from "@/lib/formato";
import { ORDENES } from "./ordenes";

// Filtros de talla, color y orden. Se aplican al elegir una opción, sin botón.
// Sigue siendo un formulario GET: sin JavaScript funciona con el botón de <noscript>,
// y los filtros quedan en la URL para poder compartirlos.
// En celular se esconden detrás de un botón para que los zapatos se vean primero.

export function FormFiltros({
  rutaBase,
  para,
  talla,
  color,
  orden,
  opciones,
  total,
  limpiarHref,
}: {
  rutaBase: string;
  para?: string;
  talla?: string;
  color?: string;
  orden: Orden;
  opciones: { tallas: number[]; colores: string[] };
  total: number;
  limpiarHref: string;
}) {
  const router = useRouter();
  const [cargando, startTransition] = useTransition();
  const [abierto, setAbierto] = useState(false);
  const activos = [talla, color].filter(Boolean).length + (orden !== "destacados" ? 1 : 0);

  function aplicar(e: FormEvent<HTMLFormElement>) {
    const params = new URLSearchParams();
    for (const [k, v] of new FormData(e.currentTarget)) {
      // Se omiten los valores por defecto para que la URL quede limpia
      if (v && !(k === "orden" && v === "destacados")) params.set(k, String(v));
    }
    const qs = params.toString();
    startTransition(() => router.push(qs ? `${rutaBase}?${qs}` : rutaBase, { scroll: false }));
  }

  return (
    <div className="border-y border-cafe/10">
      <div className="flex items-center justify-between py-3 md:hidden">
        <button
          type="button"
          onClick={() => setAbierto((a) => !a)}
          aria-expanded={abierto}
          aria-controls="filtros"
          className="etiqueta flex min-h-11 items-center gap-2"
        >
          Filtrar y ordenar
          {activos > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-cafe px-1 text-[0.625rem] text-hueso">{activos}</span>
          )}
          <span aria-hidden className={`inline-block text-lg leading-none transition-transform ${abierto ? "rotate-45" : ""}`}>+</span>
        </button>
        <Conteo total={total} cargando={cargando} />
      </div>

      <form
        // Se vuelve a montar cuando cambian los filtros en la URL (p. ej. "Quitar filtros")
        key={`${talla}|${color}|${orden}`}
        id="filtros"
        method="get"
        action={rutaBase}
        onChange={aplicar}
        onSubmit={(e) => {
          e.preventDefault();
          aplicar(e);
        }}
        className={`${abierto ? "grid" : "hidden"} grid-cols-2 gap-3 pb-4 md:flex md:flex-wrap md:items-end md:py-4`}
      >
        {para && <input type="hidden" name="para" value={para} />}
        <Selector id="f-talla" nombre="talla" etiqueta="Talla (MX)" valor={talla} ancho="md:min-w-28">
          <option value="">Todas</option>
          {opciones.tallas.map((t) => (
            <option key={t} value={t}>
              {formatTalla(t)}
            </option>
          ))}
        </Selector>
        <Selector id="f-color" nombre="color" etiqueta="Color" valor={color} ancho="md:min-w-32">
          <option value="">Todos</option>
          {opciones.colores.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Selector>
        <div className="col-span-2 md:col-span-1">
          <Selector id="f-orden" nombre="orden" etiqueta="Ordenar" valor={orden} ancho="md:min-w-48">
            {ORDENES.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.texto}
              </option>
            ))}
          </Selector>
        </div>
        <noscript>
          <button type="submit" className="btn-primario min-h-11 px-5">
            Aplicar
          </button>
        </noscript>
        {(talla || color) && (
          <Link href={limpiarHref} scroll={false} className="enlace col-span-2 self-center text-sm md:ml-1">
            Quitar filtros
          </Link>
        )}
        <div className="ml-auto hidden self-center md:block">
          <Conteo total={total} cargando={cargando} />
        </div>
      </form>
    </div>
  );
}

function Conteo({ total, cargando }: { total: number; cargando: boolean }) {
  return (
    <p className="text-sm text-cafe/85" aria-live="polite">
      {cargando ? "Buscando…" : `${total} ${total === 1 ? "modelo" : "modelos"}`}
    </p>
  );
}

function Selector({
  id,
  nombre,
  etiqueta,
  valor,
  ancho,
  children,
}: {
  id: string;
  nombre: string;
  etiqueta: string;
  valor?: string;
  ancho: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="campo-label text-xs">
        {etiqueta}
      </label>
      <select id={id} name={nombre} defaultValue={valor ?? ""} className={`campo w-full py-2 md:w-auto ${ancho}`}>
        {children}
      </select>
    </div>
  );
}
