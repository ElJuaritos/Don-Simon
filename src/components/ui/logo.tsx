import { marca } from "@/config/marca";

// Logotipo provisional en tipografía caligráfica.
// TODO: reemplazar por el SVG oficial del monograma + logotipo (docs/02-identidad-de-marca.md).

export function Logo({
  className = "",
  conFecha = false,
}: {
  className?: string;
  conFecha?: boolean;
}) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span className="font-script text-[1em] whitespace-nowrap">{marca.nombre}</span>
      {conFecha && (
        <span className="mt-[0.35em] font-sans text-[0.18em] tracking-[0.2em]">
          Est. {marca.fundada}
        </span>
      )}
    </span>
  );
}

/** Monograma provisional: dos "S" entrelazadas */
export function Monograma({ className = "" }: { className?: string }) {
  return (
    <span className={`font-script leading-none ${className}`} aria-hidden>
      <span className="relative inline-block">
        S<span className="absolute left-[0.28em] top-[0.06em] -scale-x-100">S</span>
      </span>
    </span>
  );
}
