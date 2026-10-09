import type { ReactNode } from "react";
import { Foto } from "@/components/ui/foto";

/**
 * Ficha de lámina 14: foto grande a un lado y el texto al otro, alternando.
 * La usan Pieles y Nuestras hormas para que se vean iguales.
 */
export function FichaLateral({
  id,
  etiqueta,
  titulo,
  texto,
  extra,
  imagen,
  notaFoto,
  invertido = false,
}: {
  id: string;
  etiqueta?: string;
  titulo: string;
  texto?: string;
  extra?: ReactNode;
  imagen: { url: string; alt: string } | null;
  notaFoto?: string;
  invertido?: boolean;
}) {
  return (
    <section id={id} className="revelar grid scroll-mt-36 items-center gap-8 md:grid-cols-12 md:gap-6" aria-labelledby={`${id}-titulo`}>
      <Foto
        imagen={imagen}
        tono={invertido ? "claro" : "topo"}
        nota={notaFoto}
        sinIlustracion
        sizes="(min-width: 768px) 50vw, 100vw"
        className={`aspect-[4/5] md:col-span-6 md:aspect-square ${invertido ? "md:order-2 md:col-start-7" : ""}`}
      />
      <div className={`md:col-span-5 ${invertido ? "md:order-1 md:col-start-1" : "md:col-start-8"}`}>
        {etiqueta && <p className="etiqueta text-negro/85">{etiqueta}</p>}
        <h2 id={`${id}-titulo`} className="titulo-display mt-3 text-4xl md:text-5xl">
          {titulo}
        </h2>
        {texto && <p className="mt-6 whitespace-pre-line">{texto}</p>}
        {extra}
      </div>
    </section>
  );
}
