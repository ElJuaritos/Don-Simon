import type { BloqueResuelto } from "@/lib/data/contenido";
import { Foto } from "@/components/ui/foto";

/** Galería asimétrica: una foto vertical grande y dos horizontales apiladas a su lado. */
export function Galeria({ fotos, titulo }: { fotos: BloqueResuelto[]; titulo?: string }) {
  const [grande, ...chicas] = fotos;
  if (!grande) return null;
  return (
    <section className="contenedor revelar py-12 md:py-20" aria-label={titulo ?? "Galería"}>
      <div className="grid gap-2 md:grid-cols-12 md:gap-3">
        <FotoConPie bloque={grande} className="aspect-[4/5] md:col-span-7 md:aspect-auto md:h-full" sizes="(min-width: 768px) 58vw, 100vw" />
        <div className="grid grid-cols-2 gap-2 md:col-span-5 md:grid-cols-1 md:gap-3">
          {chicas.map((b) => (
            <FotoConPie key={b.clave} bloque={b} className="aspect-square md:aspect-[3/2]" sizes="(min-width: 768px) 40vw, 50vw" />
          ))}
        </div>
      </div>
    </section>
  );
}

function FotoConPie({ bloque, className, sizes }: { bloque: BloqueResuelto; className: string; sizes: string }) {
  return (
    <figure className={`relative ${className}`}>
      <Foto imagen={bloque.imagen} tono="claro" nota={bloque.notaFoto} sinIlustracion sizes={sizes} className="h-full w-full" />
      {bloque.titulo && (
        <figcaption className={`etiqueta absolute right-3 top-3 text-[0.625rem] ${bloque.imagen ? "text-white" : "text-cafe/85"}`}>
          {bloque.titulo}
        </figcaption>
      )}
    </figure>
  );
}
