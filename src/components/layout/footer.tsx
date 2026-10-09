import Link from "next/link";
import { marca } from "@/config/marca";
import { IconoFacebook, IconoInstagram, IconoPinterest, IconoTiktok, IconoYoutube } from "@/components/ui/iconos-redes";
import { LogosPago } from "@/components/ui/logos-pago";
import { FormNewsletter } from "./form-newsletter";
import { seMuestranResenas } from "@/lib/data/resenas";
import { hayNotasPublicadas } from "@/lib/data/notas";
import { hayPielesActivas } from "@/lib/data/pieles";
import { columnasFooter } from "./navegacion";

const REDES = [
  { href: marca.instagram, nombre: "Instagram", Icono: IconoInstagram },
  { href: marca.facebook, nombre: "Facebook", Icono: IconoFacebook },
  { href: marca.tiktok, nombre: "TikTok", Icono: IconoTiktok },
  { href: marca.pinterest, nombre: "Pinterest", Icono: IconoPinterest },
  { href: marca.youtube, nombre: "YouTube", Icono: IconoYoutube },
].filter((r) => r.href);

/** Footer en pizarra: enlaces claros, boletín con campo blanco y franja legal en el mismo azul. */
export async function Footer() {
  const [resenas, pieles, notas] = await Promise.all([seMuestranResenas(), hayPielesActivas(), hayNotasPublicadas()]);
  const columnas = columnasFooter({ resenas, pieles, notas });
  const anio = new Date().getFullYear();

  const lista = (enlaces: { href: string; texto: string }[]) => (
    <ul className="space-y-2">
      {enlaces.map((e) => (
        <li key={`${e.texto}-${e.href}`}>
          <Link href={e.href} className="texto-nav inline-block py-1 text-blanco/80 hover:text-blanco">
            {e.texto}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="foco-claro mt-auto bg-pizarra text-blanco">
      <div className="contenedor grid gap-10 py-14 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4 lg:col-start-9">
          <h2 className="text-lg font-medium">Novedades</h2>
          <p className="mt-3 max-w-sm text-sm">Lanzamientos y noticias del taller. Sin spam.</p>
          <div className="mt-5 max-w-md">
            <FormNewsletter />
          </div>
          {REDES.length > 0 && (
            <ul aria-label="Redes" className="mt-6 flex gap-1">
              {REDES.map((r) => (
                <li key={r.nombre}>
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={r.nombre}
                    className="grid h-11 w-11 place-items-center hover:opacity-80"
                  >
                    <r.Icono />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="hidden lg:col-span-8 lg:col-start-1 lg:row-start-1 lg:grid lg:grid-cols-4 lg:gap-6">
          {columnas.map((col) => (
            <nav key={col.titulo} aria-label={col.titulo}>
              <h2 className="etiqueta text-blanco">{col.titulo}</h2>
              <div className="mt-4">{lista(col.enlaces)}</div>
            </nav>
          ))}
        </div>

        <div className="border-t border-blanco/20 lg:hidden">
          {columnas.map((col) => (
            <details key={col.titulo} className="group border-b border-blanco/20">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {col.titulo}
                <span className="text-blanco/80 group-open:hidden" aria-hidden>
                  +
                </span>
                <span className="hidden text-blanco/80 group-open:inline" aria-hidden>
                  −
                </span>
              </summary>
              <div className="pb-4">{lista(col.enlaces)}</div>
            </details>
          ))}
        </div>
      </div>

      <div id="franja-legal" className="border-t border-blanco/20">
        <div className="contenedor flex flex-col gap-4 py-6 text-[0.8125rem] md:flex-row md:items-center md:justify-between">
          <p>
            © {anio} {marca.nombre}
          </p>
          <LogosPago />
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/legal/aviso-de-privacidad" className="text-blanco/80 underline-offset-2 hover:text-blanco hover:underline">
              Aviso de privacidad
            </Link>
            <Link href="/legal/terminos-y-condiciones" className="text-blanco/80 underline-offset-2 hover:text-blanco hover:underline">
              Términos
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
