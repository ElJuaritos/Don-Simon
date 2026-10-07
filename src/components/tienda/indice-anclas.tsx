/** Índice de anclas. En escritorio se queda fijo al hacer scroll; en el celular es una fila que se desliza. */
export function IndiceAnclas({
  enlaces,
  etiqueta = "En esta página",
}: {
  enlaces: { href: string; texto: string }[];
  etiqueta?: string;
}) {
  if (enlaces.length === 0) return null;
  return (
    <nav
      aria-label={etiqueta}
      className="border-y border-cafe/10 bg-hueso lg:sticky lg:top-[4.75rem] lg:z-30 lg:bg-hueso/95"
    >
      <ul className="contenedor flex gap-6 overflow-x-auto py-3">
        {enlaces.map((e) => (
          <li key={e.href} className="shrink-0">
            <a href={e.href} className="inline-block py-1 text-sm whitespace-nowrap hover:opacity-60">
              {e.texto}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
