"use client";

import { useState } from "react";
import Link from "next/link";
import { Foto } from "@/components/ui/foto";

export type NotaTarjeta = {
  slug: string;
  titulo: string;
  fecha: string;
  imagen: { url: string; alt: string } | null;
};

/** Rejilla de notas: 1 columna en el celular, 2 en pantallas más anchas. Muestra 12 y pide ver más. */
export function ListaNotas({ notas }: { notas: NotaTarjeta[] }) {
  const [visibles, setVisibles] = useState(12);
  const pagina = notas.slice(0, visibles);

  return (
    <>
      <ul className="grid gap-10 sm:grid-cols-2">
        {pagina.map((n) => (
          <li key={n.slug}>
            <Link href={`/notas/${n.slug}`} className="group block">
              <Foto
                imagen={n.imagen}
                tono="piedra"
                sinIlustracion
                sizes="(min-width: 640px) 45vw, 100vw"
                className="aspect-[3/2]"
              />
              <h2 className="etiqueta mt-4 text-cafe group-hover:opacity-60">{n.titulo}</h2>
              <p className="mt-2 text-sm text-cafe/75">{n.fecha}</p>
            </Link>
          </li>
        ))}
      </ul>
      {visibles < notas.length && (
        <button type="button" className="btn-contorno mt-12" onClick={() => setVisibles((n) => n + 12)}>
          Ver más
        </button>
      )}
    </>
  );
}
