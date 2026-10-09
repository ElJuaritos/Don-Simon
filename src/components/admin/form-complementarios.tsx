"use client";

import { useState, type FormEvent } from "react";
import { buscarParaCombinar, guardarComplementarios } from "@/lib/actions/admin";
import { FormAdmin } from "./form-admin";

type Item = { id: string; nombre: string };

/** Hasta 6 productos para «Combínalo con», en el orden que se muestran. */
export function FormComplementarios({ productoId, iniciales }: { productoId: string; iniciales: Item[] }) {
  const [lista, setLista] = useState(iniciales);
  const [consulta, setConsulta] = useState("");
  const [resultados, setResultados] = useState<Item[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [aviso, setAviso] = useState("");

  async function buscar(e: FormEvent) {
    e.preventDefault();
    setBuscando(true);
    setAviso("");
    const encontrados = await buscarParaCombinar(consulta, productoId);
    setResultados(encontrados);
    setBuscando(false);
    if (encontrados.length === 0) setAviso("No encontré productos con ese nombre.");
  }

  function agregar(item: Item) {
    if (lista.some((l) => l.id === item.id)) return;
    if (lista.length >= 6) {
      setAviso("Puedes ligar hasta 6 productos.");
      return;
    }
    setLista([...lista, item]);
    setAviso("");
  }

  function mover(indice: number, direccion: -1 | 1) {
    const destino = indice + direccion;
    if (destino < 0 || destino >= lista.length) return;
    const copia = [...lista];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    setLista(copia);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={buscar} className="flex flex-col gap-3 sm:flex-row">
        <label className="block min-w-0 flex-1">
          <span className="sr-only">Buscar producto</span>
          <input
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            className="campo"
            placeholder="Busca por nombre"
            minLength={2}
            required
          />
        </label>
        <button type="submit" className="btn-contorno" disabled={buscando}>
          {buscando ? "Buscando…" : "Buscar"}
        </button>
      </form>
      {aviso && <p className="text-sm text-negro/85">{aviso}</p>}
      {resultados.length > 0 && (
        <ul className="divide-y divide-negro/10 border border-negro/15">
          {resultados.map((r) => (
            <li key={r.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <span>{r.nombre}</span>
              <button type="button" className="enlace min-h-11 px-2" onClick={() => agregar(r)}>
                Agregar
              </button>
            </li>
          ))}
        </ul>
      )}

      <FormAdmin action={guardarComplementarios} boton="Guardar combínalo con" botonClase="btn-contorno">
        <input type="hidden" name="productoId" value={productoId} />
        {lista.map((item) => (
          <input key={item.id} type="hidden" name="complementarioId" value={item.id} />
        ))}
        {lista.length === 0 ? (
          <p className="text-negro/85">Todavía no hay productos ligados. Si lo dejas vacío, la ficha sugiere accesorios con existencias.</p>
        ) : (
          <ol className="divide-y divide-negro/10 border border-negro/15">
            {lista.map((item, i) => (
              <li key={item.id} className="flex flex-wrap items-center gap-2 px-3 py-2">
                <span className="min-w-0 flex-1">{item.nombre}</span>
                <button type="button" className="enlace min-h-11 px-2" onClick={() => mover(i, -1)} disabled={i === 0}>
                  Subir
                </button>
                <button type="button" className="enlace min-h-11 px-2" onClick={() => mover(i, 1)} disabled={i === lista.length - 1}>
                  Bajar
                </button>
                <button type="button" className="enlace min-h-11 px-2" onClick={() => setLista(lista.filter((l) => l.id !== item.id))}>
                  Quitar
                </button>
              </li>
            ))}
          </ol>
        )}
      </FormAdmin>
    </div>
  );
}
