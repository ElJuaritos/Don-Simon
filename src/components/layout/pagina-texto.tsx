import Link from "next/link";
import type { PaginaContenido } from "@/content/ayuda";

export function PaginaTexto({
  pagina,
  seccion,
}: {
  pagina: PaginaContenido;
  seccion?: { href: string; texto: string };
}) {
  return (
    <article className="contenedor max-w-3xl py-12 md:py-20">
      {seccion && (
        <nav aria-label="Migas de pan" className="text-sm text-cafe/85">
          <Link href={seccion.href} className="hover:text-cafe">
            {seccion.texto}
          </Link>
        </nav>
      )}
      <h1 className="titulo-display mt-3 text-5xl md:text-6xl">{pagina.titulo}</h1>
      <p className="mt-4 text-lg text-cafe/80">{pagina.descripcion}</p>
      <div className="prosa mt-10">{pagina.contenido}</div>
    </article>
  );
}
