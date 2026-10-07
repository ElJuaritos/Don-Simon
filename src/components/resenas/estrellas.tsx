/** Estrella de línea. El color lo pone el texto del contenedor (café o terracota). */
export function IconoEstrella({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden fill="currentColor">
      <path d="M10 1.6 12.4 7l5.8.5-4.4 3.8 1.4 5.6L10 14.2 4.8 17l1.4-5.6L1.8 7.5 7.6 7 10 1.6Z" />
    </svg>
  );
}

/** Estrellas con relleno parcial. El lector de pantalla oye el valor, no los íconos. */
export function Estrellas({ valor }: { valor: number }) {
  const texto = `${new Intl.NumberFormat("es-MX", { maximumFractionDigits: 1 }).format(valor)} de 5 estrellas`;
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="sr-only">{texto}</span>
      <span aria-hidden className="inline-flex">
        {Array.from({ length: 5 }, (_, i) => {
          const lleno = Math.min(1, Math.max(0, valor - i));
          return (
            <span key={i} className="relative inline-block h-4 w-4">
              <IconoEstrella className="absolute inset-0 h-4 w-4 text-cafe/20" />
              <span className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${lleno * 100}%` }}>
                <IconoEstrella className="h-4 w-4 text-terracota" />
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
