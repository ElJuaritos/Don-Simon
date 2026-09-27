import Image from "next/image";

// Mientras no haya fotografía real, los espacios de imagen muestran un bloque de color
// de la marca con una ilustración de línea y una nota de qué foto va ahí.

const TONOS = {
  cafe: "bg-cafe text-crema/85",
  olivo: "bg-olivo text-white/80",
  terracota: "bg-terracota text-white/80",
  crema: "bg-crema text-cafe/80",
  claro: "bg-[#ece3d6] text-cafe/55",
} as const;
export type Tono = keyof typeof TONOS;

export function SiluetaZapato({ className = "", color }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 200 100" className={className} aria-hidden fill="none">
      <path
        d="M18 74c0-14 4-26 12-30l28-4c12-2 26-10 38-10 16 0 28 10 44 16 20 6 42 10 48 20 4 6 0 12-8 12H24c-4 0-6-1-6-4Z"
        fill={color ?? "currentColor"}
        fillOpacity={color ? 0.92 : 0.14}
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M16 78h170c2 0 4 2 2 5l-168 1c-3 0-5-3-4-6Z" fill="currentColor" fillOpacity=".35" />
      <path d="M20 84h24v6H22Z" fill="currentColor" fillOpacity=".35" />
      <path
        d="M34 52c22-4 44-12 62-14 14 0 26 8 40 14"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 3"
        opacity=".7"
      />
      <path d="M96 38c8 6 18 8 30 8" stroke="currentColor" strokeWidth="1" opacity=".6" />
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
      className={`textura relative flex items-center justify-center overflow-hidden ${TONOS[tono]} ${className}`}
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

export function FotoProducto({
  imagen,
  colorZapato,
  className = "",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  prioridad = false,
}: {
  imagen: { url: string; alt: string } | null;
  colorZapato?: string;
  className?: string;
  sizes?: string;
  prioridad?: boolean;
}) {
  if (!imagen) {
    return <FotoPendiente tono="claro" colorZapato={colorZapato} className={className} />;
  }
  return (
    <div className={`relative overflow-hidden bg-[#ece3d6] ${className}`}>
      <Image
        src={imagen.url}
        alt={imagen.alt}
        fill
        sizes={sizes}
        priority={prioridad}
        className="object-cover"
      />
    </div>
  );
}
