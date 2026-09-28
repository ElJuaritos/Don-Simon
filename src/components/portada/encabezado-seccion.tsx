import Link from "next/link";

/** Encabezado de sección: etiqueta, título y un enlace opcional a la derecha. */
export function EncabezadoSeccion({
  id,
  etiqueta,
  titulo,
  enlace,
}: {
  id: string;
  etiqueta?: string;
  titulo: string;
  enlace?: { href: string; texto: string };
}) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6 md:mb-14">
      <div>
        {etiqueta && <p className="etiqueta text-cafe/85">{etiqueta}</p>}
        <h2 id={id} className="titulo-display mt-3 text-4xl md:text-5xl">
          {titulo}
        </h2>
      </div>
      {enlace && (
        <Link href={enlace.href} className="enlace-etiqueta mb-2 hidden shrink-0 sm:inline-block">
          {enlace.texto}
        </Link>
      )}
    </div>
  );
}
