"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { AnchoPie } from "@/db/schema";
import type { ResenaPublica } from "@/lib/data/resenas";
import { ETIQUETA_ANCHO, OPCIONES_AJUSTE } from "@/lib/resenas-texto";
import { formatFecha } from "@/lib/formato";
import { FotoProducto } from "@/components/ui/foto";
import { Estrellas } from "./estrellas";

const PASO = 5;

/** Lista publicada, de 5 en 5, con los filtros que pida cada página. */
export function ListaResenas({
  resenas,
  buscar = false,
  ancho = false,
  mostrarProducto = false,
}: {
  resenas: ResenaPublica[];
  buscar?: boolean;
  ancho?: boolean;
  mostrarProducto?: boolean;
}) {
  const [q, setQ] = useState("");
  const [estrellas, setEstrellas] = useState(0);
  const [anchoPie, setAnchoPie] = useState<AnchoPie | "">("");
  const [visibles, setVisibles] = useState(PASO);

  const filtradas = useMemo(() => {
    const texto = q.trim().toLocaleLowerCase("es-MX");
    return resenas.filter((r) => {
      if (estrellas && r.calificacion !== estrellas) return false;
      if (anchoPie && r.anchoPie !== anchoPie) return false;
      if (!texto) return true;
      const bolsa = `${r.titulo} ${r.texto} ${r.nombre}`.toLocaleLowerCase("es-MX");
      return bolsa.includes(texto);
    });
  }, [resenas, q, estrellas, anchoPie]);

  const pagina = filtradas.slice(0, visibles);
  const ajusteDe = (n: number) => OPCIONES_AJUSTE.find((o) => o.valor === n)?.etiqueta;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {buscar && (
          <label className="block sm:col-span-2 lg:col-span-1">
            <span className="campo-label">Buscar</span>
            <input value={q} onChange={(e) => { setQ(e.target.value); setVisibles(PASO); }} className="campo" type="search" placeholder="Palabra en el texto" />
          </label>
        )}
        <label className="block">
          <span className="campo-label">Calificación</span>
          <select
            className="campo"
            value={estrellas}
            onChange={(e) => {
              setEstrellas(Number(e.target.value));
              setVisibles(PASO);
            }}
          >
            <option value={0}>Todas</option>
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "estrella" : "estrellas"}
              </option>
            ))}
          </select>
        </label>
        {ancho && (
          <label className="block">
            <span className="campo-label">Ancho de pie</span>
            <select
              className="campo"
              value={anchoPie}
              onChange={(e) => {
                setAnchoPie(e.target.value as AnchoPie | "");
                setVisibles(PASO);
              }}
            >
              <option value="">Todos</option>
              {(Object.keys(ETIQUETA_ANCHO) as AnchoPie[]).map((a) => (
                <option key={a} value={a}>
                  {ETIQUETA_ANCHO[a]}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {pagina.length === 0 ? (
        <p className="mt-8 text-sm text-negro/75">Ninguna reseña coincide con tu búsqueda.</p>
      ) : (
        <ul className="mt-8 divide-y divide-negro/10">
          {pagina.map((r) => (
            <li key={r.id} className="py-6">
              {mostrarProducto && (
                <Link href={`/producto/${r.producto.slug}`} className="mb-4 flex items-center gap-3 hover:opacity-70">
                  <FotoProducto imagen={r.producto.imagen} sizes="64px" className="h-16 w-14 shrink-0" />
                  <span className="font-medium">{r.producto.nombre}</span>
                </Link>
              )}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span className="font-medium">{r.nombre}</span>
                {r.verificada && <span className="text-negro/70">Compra verificada</span>}
                {r.ciudad && <span className="text-negro/70">{r.ciudad}</span>}
                <span className="text-negro/70">Pie {ETIQUETA_ANCHO[r.anchoPie].toLocaleLowerCase("es-MX")}</span>
              </div>
              <div className="mt-2">
                <Estrellas valor={r.calificacion} />
              </div>
              <h3 className="mt-3 font-medium">{r.titulo}</h3>
              <p className="mt-2 max-w-2xl whitespace-pre-wrap text-sm leading-relaxed">{r.texto}</p>
              <p className="mt-2 text-xs text-negro/60">
                <time dateTime={r.fecha}>{formatFecha(new Date(r.fecha))}</time>
                {ajusteDe(r.ajuste) && <span> · {ajusteDe(r.ajuste)}</span>}
              </p>
              {r.respuesta && (
                <div className="mt-4 max-w-2xl border-l-2 border-negro/20 bg-niebla/50 px-4 py-3">
                  <p className="text-sm font-medium">Respuesta de la tienda</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">{r.respuesta}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {visibles < filtradas.length && (
        <button type="button" onClick={() => setVisibles((v) => v + PASO)} className="btn-contorno mt-4">
          Ver más
        </button>
      )}
    </div>
  );
}
