import Link from "next/link";
import { tienda } from "@/config/marca";
import { contarCarrito } from "@/lib/carrito";
import { getCategorias } from "@/lib/data/catalogo";
import { IconoBolsa, IconoBuscar } from "@/components/ui/iconos";
import { Logo } from "@/components/ui/logo";
import { Desplegable } from "./desplegable";
import { MenuMovil } from "./menu-movil";
import { LA_CASA, TIENDA_PUBLICO } from "./navegacion";

// Header fijo: tienda a la izquierda, logotipo al centro, marca y carrito a la derecha.
// En celular: menú a la izquierda, logo al centro, buscar y carrito a la derecha.

export async function Header() {
  const [cantidad, categorias] = await Promise.all([contarCarrito(), getCategorias()]);
  const enlacesCategorias = [
    ...categorias.map((c) => ({ href: `/coleccion/${c.slug}`, texto: c.nombre })),
    { href: "/coleccion", texto: "Ver todo" },
  ];

  return (
    <>
      {tienda.anuncio && (
        <div className="bg-cafe px-4 py-2 text-center text-[0.75rem] font-medium tracking-wide text-crema-claro">
          {tienda.anuncio}
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-cafe/10 bg-hueso/95 backdrop-blur supports-[backdrop-filter]:bg-hueso/85">
        <div className="contenedor grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[4.75rem]">
          <nav aria-label="Tienda" className="flex items-center gap-8">
            <MenuMovil categorias={enlacesCategorias} />
            <div className="hidden items-center gap-8 md:flex">
              {TIENDA_PUBLICO.map((e) => (
                <Link key={e.href} href={e.href} className="etiqueta py-7 transition-opacity hover:opacity-60">
                  {e.texto}
                </Link>
              ))}
              <Desplegable titulo="Colección" href="/coleccion" enlaces={enlacesCategorias} />
            </div>
          </nav>

          <Link href="/" aria-label="Inicio" className="text-[1.9rem] md:text-[2.4rem]">
            <Logo />
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-4">
            <div className="hidden md:block">
              <Desplegable titulo="La casa" href="/nuestra-historia" enlaces={LA_CASA} alinear="derecha" />
            </div>
            <Link href="/buscar" aria-label="Buscar" className="p-2 transition-opacity hover:opacity-60">
              <IconoBuscar />
            </Link>
            <Link
              href="/carrito"
              aria-label={`Carrito, ${cantidad} ${cantidad === 1 ? "par" : "pares"}`}
              className="relative -mr-2 p-2 transition-opacity hover:opacity-60"
            >
              <IconoBolsa />
              {cantidad > 0 && (
                <span className="absolute -right-0.5 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-cafe px-1 text-[0.6875rem] font-bold text-crema-claro">
                  {cantidad}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
