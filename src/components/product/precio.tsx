import { formatPrecio } from "@/lib/formato";

export function Precio({
  precio,
  comparacion,
  className = "",
}: {
  precio: number;
  comparacion?: number | null;
  className?: string;
}) {
  const enOferta = comparacion != null && comparacion > precio;
  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span className={enOferta ? "font-semibold text-terracota-oscuro" : "font-semibold"}>{formatPrecio(precio)}</span>
      {enOferta && (
        <s className="text-[0.85em] text-cafe/80">
          <span className="sr-only">Antes </span>
          {formatPrecio(comparacion)}
        </s>
      )}
    </span>
  );
}
