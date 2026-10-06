import Link from "next/link";
import { Foto } from "@/components/ui/foto";

/** Tres categorías del público, con el nombre subrayado abajo a la izquierda. */
export function TopCategorias({
  para,
  categorias,
}: {
  para: "hombre" | "mujer";
  categorias: { slug: string; nombre: string; imagen: { url: string; alt: string } | null }[];
}) {
  if (categorias.length === 0) return null;
  return (
    <section className="seccion" aria-labelledby={`top-${para}`}>
      <div className="contenedor">
        <h2 id={`top-${para}`} className="text-center text-xl font-medium md:text-2xl">
          Top categorías
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {categorias.map((c) => {
            const conFoto = Boolean(c.imagen);
            return (
              <li key={c.slug}>
                <Link href={`/coleccion/${c.slug}?para=${para}`} className="group relative block aspect-[3/4]">
                  <Foto
                    imagen={c.imagen}
                    tono="piedra"
                    nota={conFoto ? undefined : c.nombre}
                    sinIlustracion
                    cubrir
                    zoomAlPasar
                    sizes="(min-width: 640px) 30vw, 100vw"
                    className="h-full w-full"
                  />
                  {conFoto && (
                    <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-cafe-oscuro/70 to-transparent" />
                  )}
                  <span className={`enlace-nav absolute bottom-5 left-5 ${conFoto ? "text-crema-claro" : "text-cafe"}`}>{c.nombre}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
