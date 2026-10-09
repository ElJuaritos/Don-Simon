import type { Metadata } from "next";
import Link from "next/link";
import { paginasAyuda } from "@/content/ayuda";
import { IconoFlecha } from "@/components/ui/iconos";

export const metadata: Metadata = { title: "Ayuda", description: "Tallas, envíos, cambios y cuidado de tu calzado." };

export default function Ayuda() {
  return (
    <div className="contenedor max-w-4xl py-12 md:py-20">
      <h1 className="titulo-display text-5xl md:text-6xl">¿Cómo te ayudamos?</h1>
      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {Object.entries(paginasAyuda).map(([slug, p]) => (
          <li key={slug}>
            <Link
              href={`/ayuda/${slug}`}
              className="group flex h-full items-start justify-between gap-4 border border-negro/15 p-6 transition-colors hover:border-negro hover:bg-niebla/60"
            >
              <span>
                <span className="titulo-display block text-3xl">{p.titulo}</span>
                <span className="mt-2 block text-[0.9375rem] text-negro/80">{p.descripcion}</span>
              </span>
              <IconoFlecha className="mt-2 shrink-0 transition-transform group-hover:translate-x-1" />
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/rastrear"
            className="group flex h-full items-start justify-between gap-4 border border-negro/15 p-6 transition-colors hover:border-negro hover:bg-niebla/60"
          >
            <span>
              <span className="titulo-display block text-3xl">Rastrear pedido</span>
              <span className="mt-2 block text-[0.9375rem] text-negro/80">Consulta el estado con tu folio y tu correo.</span>
            </span>
            <IconoFlecha className="mt-2 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </li>
        <li>
          <Link
            href="/contacto"
            className="group flex h-full items-start justify-between gap-4 bg-negro p-6 text-blanco transition-colors hover:bg-negro/80"
          >
            <span>
              <span className="titulo-display block text-3xl">Contacto</span>
              <span className="mt-2 block text-[0.9375rem] text-blanco/85">¿No encontraste tu respuesta? Escríbenos.</span>
            </span>
            <IconoFlecha className="mt-2 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </li>
      </ul>
    </div>
  );
}
