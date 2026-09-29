import Link from "next/link";
import type { BloqueResuelto } from "@/lib/data/contenido";
import { Foto } from "@/components/ui/foto";

/** Foto principal a pantalla completa con el mensaje abajo a la izquierda. */
export function Hero({ bloque }: { bloque: BloqueResuelto }) {
  const conFoto = Boolean(bloque.imagen);
  return (
    <section className="relative h-[82svh] min-h-[30rem] md:h-[88svh]" aria-labelledby="titulo-hero">
      <Foto
        imagen={bloque.imagen}
        tono="piedra"
        nota={bloque.notaFoto}
        sinIlustracion
        sizes="100vw"
        prioridad
        encuadre="object-[72%_50%] md:object-center"
        cubrir
      />
      {conFoto && <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-cafe-oscuro/60 via-cafe-oscuro/10 to-transparent" />}

      <div className={`contenedor aparecer absolute inset-x-0 bottom-0 pb-14 md:pb-20 ${conFoto ? "text-white" : "text-cafe"}`}>
        <h1 id="titulo-hero" className="titulo-display max-w-3xl text-[2.75rem] md:text-7xl lg:text-[5.25rem]">
          {bloque.titulo}
        </h1>
        {bloque.texto && <p className="mt-5 max-w-md text-lg">{bloque.texto}</p>}
        {bloque.enlaceTexto && bloque.enlaceUrl && (
          <Link href={bloque.enlaceUrl} className={`mt-8 ${conFoto ? "btn-claro" : "btn-primario"}`}>
            {bloque.enlaceTexto}
          </Link>
        )}
      </div>
    </section>
  );
}
