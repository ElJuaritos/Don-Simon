import Link from "next/link";
import type { BloqueResuelto } from "@/lib/data/contenido";
import { Foto } from "@/components/ui/foto";

/**
 * Bloque editorial asimétrico: foto grande (7 de 12 columnas) y texto al lado.
 * En computadora la foto es 5:4 para que foto y texto quepan juntos en una pantalla.
 * `invertido` pone la foto a la derecha, para alternar entre secciones.
 */
export function EditorialDividido({
  bloque,
  etiqueta,
  invertido = false,
}: {
  bloque: BloqueResuelto;
  etiqueta?: string;
  invertido?: boolean;
}) {
  const parrafos = bloque.texto.split(/\n\s*\n/).filter(Boolean);
  return (
    <section className="contenedor revelar py-10 md:py-12" aria-labelledby={`titulo-${bloque.clave}`}>
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-8">
        <Foto
          imagen={bloque.imagen}
          tono="piedra"
          nota={bloque.notaFoto}
          sinIlustracion
          sizes="(min-width: 768px) 58vw, 100vw"
          className={`aspect-[4/5] md:col-span-7 md:aspect-[5/4] ${invertido ? "md:order-2 md:col-start-6" : ""}`}
        />
        <div className={`md:col-span-5 lg:col-span-4 ${invertido ? "md:order-1 md:col-start-1" : "md:col-start-8 lg:col-start-9"}`}>
          {etiqueta && <p className="etiqueta text-cafe/85">{etiqueta}</p>}
          <h2 id={`titulo-${bloque.clave}`} className="titulo-display mt-4 text-4xl md:text-5xl">
            {bloque.titulo}
          </h2>
          <div className="mt-6 space-y-4 lg:text-lg">
            {parrafos.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          {bloque.enlaceTexto && bloque.enlaceUrl && (
            <Link href={bloque.enlaceUrl} className="enlace-etiqueta mt-9">
              {bloque.enlaceTexto}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
