import Link from "next/link";
import type { BloqueResuelto } from "@/lib/data/contenido";
import { FotoConNombre } from "./foto-con-nombre";

/** Fila de tres fotos de una colección. En el celular se desliza de lado. */
export function FilaColeccion({
  id,
  titulo,
  explorarHref,
  fotos,
}: {
  id: string;
  titulo: string;
  explorarHref: string;
  fotos: BloqueResuelto[];
}) {
  return (
    <section className="seccion" aria-labelledby={id}>
      <div className="contenedor text-center">
        <h2 id={id} className="text-xl font-medium md:text-2xl">
          {titulo}
        </h2>
        <Link href={explorarHref} className="enlace-nav mt-3">
          Explorar todo
        </Link>
      </div>
      <ul className="mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:px-10">
        {fotos.map((foto) => (
          <li key={foto.clave} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
            <FotoConNombre
              href={foto.enlaceUrl || explorarHref}
              titulo={foto.titulo}
              imagen={foto.imagen}
              nota={foto.notaFoto}
              className="aspect-[3/4]"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
