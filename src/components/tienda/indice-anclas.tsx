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
      className="border-y border-negro/10 bg-blanco lg:sticky lg:top-32 lg:z-30"
    >
      <ul className="contenedor flex gap-6 overflow-x-auto py-3">
        {enlaces.map((e) => (
          <li key={e.href} className="shrink-0">
            <a href={e.href} className="inline-block py-1 text-sm whitespace-nowrap hover:opacity-70">
              {e.texto}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
