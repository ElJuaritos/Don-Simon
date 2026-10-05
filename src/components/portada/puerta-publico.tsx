import Link from "next/link";
import type { BloqueResuelto } from "@/lib/data/contenido";
import { Foto } from "@/components/ui/foto";

/**
 * Las dos puertas de la portada: Hombre y Mujer a pantalla completa.
 * En el celular van apiladas; en computadora, lado a lado bajo el menú.
 */
export function PuertaPublico({ bloques }: { bloques: BloqueResuelto[] }) {
  return (
    <section className="grid lg:h-[calc(100svh-7.25rem)] lg:grid-cols-2" aria-label="Comprar por público">
      {bloques.map((bloque, i) => {
        const href = bloque.enlaceUrl || "/coleccion";
        const texto = bloque.enlaceTexto || bloque.titulo;
        const conFoto = Boolean(bloque.imagen);
        return (
          <Link key={bloque.clave} href={href} className="group relative block h-[70svh] lg:h-full">
            <Foto
              imagen={bloque.imagen}
              tono="piedra"
              nota={conFoto ? undefined : bloque.notaFoto}
              sinIlustracion
              cubrir
              zoomAlPasar
              prioridad={i === 0}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-full w-full"
            />
            {conFoto && (
              <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-cafe-oscuro/70 to-transparent" />
            )}
            <span
              className={`enlace-nav absolute bottom-8 left-1/2 -translate-x-1/2 ${conFoto ? "text-crema-claro" : "text-cafe"}`}
            >
              {texto}
            </span>
          </Link>
        );
      })}
    </section>
  );
}
