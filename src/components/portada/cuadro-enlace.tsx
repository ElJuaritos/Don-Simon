import Link from "next/link";
import { Foto, type Tono } from "@/components/ui/foto";

/**
 * Cuadro con foto que lleva a otra página, con el título abajo a la izquierda.
 * Con foto real el texto va en blanco sobre un velo oscuro; sin foto, en café.
 */
export function CuadroEnlace({
  href,
  imagen,
  titulo,
  etiqueta,
  nota,
  tono = "claro",
  className = "",
  sizes,
}: {
  href: string;
  imagen: { url: string; alt: string } | null;
  titulo: string;
  etiqueta?: string;
  nota?: string;
  tono?: Tono;
  className?: string;
  sizes?: string;
}) {
  const conFoto = Boolean(imagen);
  return (
    <Link href={href} className={`group relative block overflow-hidden ${className}`}>
      <Foto imagen={imagen} tono={tono} nota={conFoto ? undefined : nota} sinIlustracion sizes={sizes} zoomAlPasar className="h-full w-full" />
      {conFoto && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-cafe-oscuro/60 to-transparent" />}
      {/* En celular el enlace va debajo del título: los cuadros pueden ser angostos (dos por fila) */}
      <div
        className={`absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4 sm:p-5 md:p-8 ${conFoto ? "text-white" : "text-cafe"} ${nota && !conFoto ? "pb-10 md:pb-12" : ""}`}
      >
        <h3 className="titulo-display text-3xl sm:text-4xl md:text-5xl">{titulo}</h3>
        {etiqueta && <span className="enlace-etiqueta mb-1.5 shrink-0">{etiqueta}</span>}
      </div>
    </Link>
  );
}
