import Link from "next/link";
import type { BloqueResuelto } from "@/lib/data/contenido";
import { Foto } from "@/components/ui/foto";

/** Dos cuadros grandes de la página de Hombre o Mujer, con el botón «Explorar» abajo al centro. */
export function HeroesPublico({ bloques }: { bloques: BloqueResuelto[] }) {
  return (
    <section className="grid md:grid-cols-2" aria-label="Explorar">
      {bloques.map((bloque, i) => {
        const texto = bloque.enlaceTexto || "Explorar";
        const href = bloque.enlaceUrl || "/coleccion";
        const conFoto = Boolean(bloque.imagen);
        return (
          <Link key={bloque.clave} href={href} className="group relative block h-[70svh] min-h-80">
            <Foto
              imagen={bloque.imagen}
              tono="topo"
              nota={conFoto ? undefined : bloque.notaFoto}
              sinIlustracion
              cubrir
              zoomAlPasar
              prioridad={i === 0}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="h-full w-full"
            />
            {conFoto && <span className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-negro/55 to-transparent" />}
            <span className={`btn-contorno-claro absolute bottom-8 left-1/2 -translate-x-1/2 ${conFoto ? "" : "border-negro/40 text-negro"}`}>
              {texto}
            </span>
          </Link>
        );
      })}
    </section>
  );
}
