import Link from "next/link";
import { marca } from "@/config/marca";
import { getCategorias } from "@/lib/data/catalogo";
import { Logo } from "@/components/ui/logo";
import { FormNewsletter } from "./form-newsletter";

export async function Footer() {
  const categorias = await getCategorias();
  const columnas = [
    {
      titulo: "Tienda",
      enlaces: [
        ...categorias.map((c) => ({ href: `/coleccion/${c.slug}`, texto: c.nombre })),
        { href: "/coleccion", texto: "Ver todo" },
      ],
    },
    {
      titulo: "Ayuda",
      enlaces: [
        { href: "/ayuda/guia-de-tallas", texto: "Guía de tallas" },
        { href: "/ayuda/envios", texto: "Envíos" },
        { href: "/ayuda/cambios-y-devoluciones", texto: "Cambios y devoluciones" },
        { href: "/ayuda/preguntas-frecuentes", texto: "Preguntas frecuentes" },
        { href: "/contacto", texto: "Contacto" },
      ],
    },
    {
      titulo: "La casa",
      enlaces: [
        { href: "/nuestra-historia", texto: "Nuestra historia" },
        { href: "/ayuda/cuidado-del-calzado", texto: "Cuidado del calzado" },
      ],
    },
  ];

  return (
    <footer className="textura mt-auto bg-cafe text-crema-claro">
      <div className="contenedor grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-12 lg:col-span-3">
          <Link href="/" aria-label="Inicio" className="text-5xl">
            <Logo conFecha />
          </Link>
          <p className="mt-6 max-w-xs text-crema/85">{marca.lema}</p>
        </div>

        {columnas.map((col) => (
          <nav key={col.titulo} aria-label={col.titulo} className="md:col-span-4 lg:col-span-2">
            <h2 className="etiqueta text-crema/85">{col.titulo}</h2>
            <ul className="mt-4 space-y-2.5 text-[0.9375rem]">
              {col.enlaces.map((e) => (
                <li key={e.href}>
                  <Link href={e.href} className="transition-opacity hover:opacity-70">
                    {e.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="md:col-span-12 lg:col-span-3">
          <h2 className="etiqueta text-crema/85">Newsletter</h2>
          <p className="mt-4 mb-4 text-[0.9375rem] text-crema/85">Lanzamientos y piezas limitadas, antes que nadie.</p>
          <FormNewsletter />
        </div>
      </div>

      <div className="border-t border-crema/15">
        <div className="contenedor flex flex-col gap-3 py-6 text-[0.8125rem] text-crema/75 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {marca.nombre}. Hecho a mano en México.
          </p>
          <p>Pagos seguros procesados por Stripe</p>
          <div className="flex gap-5">
            <Link href="/legal/aviso-de-privacidad" className="hover:text-crema-claro">
              Aviso de privacidad
            </Link>
            <Link href="/legal/terminos-y-condiciones" className="hover:text-crema-claro">
              Términos y condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
