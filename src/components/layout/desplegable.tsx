import Link from "next/link";
import type { Enlace } from "./navegacion";

/** Submenú del header (escritorio). Se abre al pasar el cursor o al llegar con el teclado. */
export function Desplegable({
  titulo,
  href,
  enlaces,
  alinear = "izquierda",
}: {
  titulo: string;
  href: string;
  enlaces: Enlace[];
  alinear?: "izquierda" | "derecha";
}) {
  return (
    <div className="group relative">
      <Link href={href} className="etiqueta block py-7 transition-opacity hover:opacity-60">
        {titulo}
      </Link>
      <div
        className={`invisible absolute top-full min-w-60 translate-y-1 border border-cafe/10 bg-hueso py-4 opacity-0 transition-all duration-300 ease-suave group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${alinear === "derecha" ? "right-0" : "-left-5"}`}
      >
        <ul>
          {enlaces.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className="block px-5 py-2 text-[0.9375rem] transition-colors hover:bg-arena">
                {e.texto}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
