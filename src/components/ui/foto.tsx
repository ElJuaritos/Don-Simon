import Image from "next/image";

// Espacios de imagen. Mientras no haya fotografía real, muestran un fondo neutro
// con una silueta de línea y una nota de qué foto va ahí, para que el dueño sepa qué subir.

const TONOS = {
  claro: "bg-arena text-cafe/55",
  piedra: "bg-piedra text-cafe/60",
  oscuro: "bg-cafe-oscuro text-crema/70",
} as const;
export type Tono = keyof typeof TONOS;

export function SiluetaZapato({ className = "", color }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 100" className={className} aria-hidden fill="none">
      <path
        d="M18 74c0-14 4-26 12-30l28-4c12-2 26-10 38-10 16 0 28 10 44 16 20 6 42 10 48 20 4 6 0 12-8 12H24c-4 0-6-1-6-4Z"
        fill={color ?? "currentColor"}
        fillOpacity={color ? 0.85 : 0.1}
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M16 78h170c2 0 4 2 2 5l-168 1c-3 0-5-3-4-6Z" fill="currentColor" fillOpacity=".3" />
      <path d="M20 84h24v6H22Z" fill="currentColor" fillOpacity=".3" />
      <path
        d="M34 52c22-4 44-12 62-14 14 0 26 8 40 14"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="2 3"
        opacity=".7"
      />
      <path d="M96 38c8 6 18 8 30 8" stroke="currentColor" strokeWidth="0.8" opacity=".6" />
    </svg>
  );
}

export function FotoPendiente({
  tono = "claro",
  nota,
  className = "",
  colorZapato,
  sinIlustracion = false,
}: {
  tono?: Tono;
  nota?: string;
  className?: string;
  colorZapato?: string;
  sinIlustracion?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${TONOS[tono]} ${className}`}
      role="img"
      aria-label={nota ? `Fotografía pendiente: ${nota}` : "Fotografía pendiente"}
    >
      {!sinIlustracion && <SiluetaZapato className="w-3/5 max-w-72" color={colorZapato} />}
      {nota && (
        <span className="etiqueta absolute bottom-3 left-3 max-w-[85%] text-[0.625rem] opacity-80">
          Foto: {nota}
        </span>
      )}
    </div>
  );
}

/** Muestra la foto si existe; si no, un espacio pendiente con la misma forma. */
export function Foto({
  imagen,
  className = "",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  prioridad = false,
  tono = "claro",
  nota,
  colorZapato,
  sinIlustracion = false,
  zoomAlPasar = false,
}: {
  imagen: { url: string; alt: string } | null;
  className?: string;
  sizes?: string;
  prioridad?: boolean;
  tono?: Tono;
  nota?: string;
  colorZapato?: string;
  sinIlustracion?: boolean;
  /** Acercamiento lento cuando el cursor está sobre un enlace padre con clase `group` */
  zoomAlPasar?: boolean;
}) {
  const zoom = zoomAlPasar ? "transition-transform duration-[1200ms] ease-suave group-hover:scale-[1.03]" : "";
  if (!imagen) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <FotoPendiente
          tono={tono}
          nota={nota}
          colorZapato={colorZapato}
          sinIlustracion={sinIlustracion}
          className={`h-full w-full ${zoom}`}
        />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-arena ${className}`}>
      <Image src={imagen.url} alt={imagen.alt} fill sizes={sizes} priority={prioridad} className={`object-cover ${zoom}`} />
    </div>
  );
}

/** Foto de producto (4:5): igual que Foto, con la silueta del color del modelo mientras no hay foto. */
export function FotoProducto(props: {
  imagen: { url: string; alt: string } | null;
  colorZapato?: string;
  className?: string;
  sizes?: string;
  prioridad?: boolean;
  zoomAlPasar?: boolean;
}) {
  return <Foto {...props} tono="claro" />;
}
