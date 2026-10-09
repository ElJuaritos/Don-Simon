"use client";

import Link from "next/link";
import Image from "next/image";
import { FotoConNombre } from "@/components/portada/foto-con-nombre";
import type { EntradaNav } from "./navegacion";

/** Panel ancho del menú: columnas de enlaces y tres fotos. */
export function PanelMega({ menu }: { menu: Extract<EntradaNav, { tipo: "menu" }> }) {
  return (
    <div
      id={`mega-${menu.id}`}
      className="absolute inset-x-0 top-full max-h-[calc(100svh-8rem)] overflow-y-auto border-b border-negro/10 bg-blanco"
    >
      <div className="contenedor grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-10">
        <div className="grid gap-6 sm:grid-cols-3 sm:gap-0">
          {menu.columnas.map((col, i) => (
            <div key={col.titulo} className={i > 0 ? "sm:border-l sm:border-negro/10 sm:pl-6" : "sm:pr-6"}>
              <p className="etiqueta text-negro/85">{col.titulo}</p>
              <ul className="mt-4 space-y-1">
                {col.enlaces.map((e) => (
                  <li key={`${col.titulo}-${e.texto}`}>
                    <Link href={e.href} className="texto-nav flex items-center gap-3 py-1.5 transition-opacity hover:opacity-60">
                      {e.imagen && (
                        <span className="relative h-14 w-11 shrink-0">
                          <Image src={e.imagen.url} alt="" fill sizes="44px" className="object-cover" />
                        </span>
                      )}
                      {e.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <ul className="grid grid-cols-3 gap-3">
          {menu.fotos.map((foto) => (
            <li key={foto.titulo}>
              <FotoConNombre
                href={foto.href}
                titulo={foto.titulo}
                imagen={foto.imagen}
                nota={foto.nota}
                sizes="18vw"
                className="aspect-[3/4]"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
