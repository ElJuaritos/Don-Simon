import Link from "next/link";
import { marca } from "@/config/marca";
import { getCategorias } from "@/lib/data/catalogo";
import { Logo } from "@/components/ui/logo";
import { FormNewsletter } from "./form-newsletter";
import { AYUDA, LA_CASA, TIENDA_PUBLICO } from "./navegacion";

// Footer claro: newsletter arriba, columnas de enlaces y avisos legales abajo.

export async function Footer() {
  const categorias = await getCategorias();
  const columnas = [
    {
      titulo: "Tienda",
      enlaces: [
        ...TIENDA_PUBLICO,
        ...categorias.map((c) => ({ href: `/coleccion/${c.slug}`, texto: c.nombre })),
      ],
    },
    { titulo: "La casa", enlaces: LA_CASA },
    { titulo: "Ayuda", enlaces: AYUDA },
  ];
  const redes = [
    { href: marca.instagram, texto: "Instagram" },
    { href: marca.facebook, texto: "Facebook" },
    { href: marca.tiktok, texto: "TikTok" },
  ].filter((r) => r.href);

  return (
    <footer className="mt-auto border-t border-cafe/10 bg-arena">
      <div className="contenedor grid gap-14 py-16 md:grid-cols-12 md:py-24">
        <div className="md:col-span-12 lg:col-span-4">
          <Link href="/" aria-label="Inicio" className="text-5xl">
            <Logo conFecha />
          </Link>
          <p className="mt-8 max-w-sm">Lanzamientos, piezas limitadas y noticias del taller. Sin spam.</p>
          <div className="mt-5 max-w-sm">
            <FormNewsletter />
          </div>
        </div>

        {columnas.map((col) => (
          <nav key={col.titulo} aria-label={col.titulo} className="md:col-span-4 lg:col-span-2 lg:first-of-type:col-start-7">
            <h2 className="etiqueta text-cafe/85">{col.titulo}</h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {col.enlaces.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="transition-opacity hover:opacity-60">
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-cafe/10">
        <div className="contenedor flex flex-col gap-3 py-6 text-[0.8125rem] text-cafe/85 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {marca.nombre}. Hecho a mano en México.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {redes.map((r) => (
              <a key={r.texto} href={r.href} target="_blank" rel="noopener noreferrer" className="hover:text-cafe">
                {r.texto}
              </a>
            ))}
            <Link href="/legal/aviso-de-privacidad" className="hover:text-cafe">
              Aviso de privacidad
            </Link>
            <Link href="/legal/terminos-y-condiciones" className="hover:text-cafe">
              Términos y condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
