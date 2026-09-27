import Link from "next/link";
import { tienda } from "@/config/marca";
import { contarCarrito } from "@/lib/carrito";
import { getCategorias } from "@/lib/data/catalogo";
import { IconoBolsa, IconoBuscar } from "@/components/ui/iconos";
import { Logo } from "@/components/ui/logo";
import { MenuMovil } from "./menu-movil";

export async function Header() {
  const [cantidad, categorias] = await Promise.all([contarCarrito(), getCategorias()]);
  const enlaces = [
    { href: "/coleccion", texto: "Colección" },
    { href: "/nuestra-historia", texto: "Nuestra historia" },
    { href: "/ayuda", texto: "Ayuda" },
  ];

  return (
    <>
      {tienda.anuncio && (
        <div className="bg-cafe px-4 py-2 text-center text-[0.75rem] font-medium tracking-wide text-crema-claro">
          {tienda.anuncio}
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-cafe/10 bg-crema-claro/95 backdrop-blur supports-[backdrop-filter]:bg-crema-claro/85">
        <div className="contenedor grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
          <nav aria-label="Principal" className="flex items-center gap-8">
            <MenuMovil enlaces={enlaces} categorias={categorias.map((c) => ({ nombre: c.nombre, slug: c.slug }))} />
            <div className="group relative hidden md:block">
              <Link href="/coleccion" className="etiqueta py-6 transition-opacity hover:opacity-70">
                Colección
              </Link>
              <div className="invisible absolute left-0 top-full min-w-56 translate-y-1 border border-cafe/10 bg-crema-claro py-3 opacity-0 shadow-sm transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                {categorias.map((c) => (
                  <Link
                    key={c.id}
                    href={`/coleccion/${c.slug}`}
                    className="block px-5 py-2 text-sm transition-colors hover:bg-crema"
                  >
                    {c.nombre}
                  </Link>
                ))}
                <Link href="/coleccion" className="block px-5 py-2 text-sm font-semibold hover:bg-crema">
                  Ver todo
                </Link>
              </div>
            </div>
            {enlaces.slice(1).map((e) => (
              <Link
                key={e.href}
                href={e.href}
                className="etiqueta hidden transition-opacity hover:opacity-70 md:block"
              >
                {e.texto}
              </Link>
            ))}
          </nav>

          <Link href="/" aria-label="Inicio" className="text-[2rem] md:text-[2.5rem]">
            <Logo />
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-3">
            <Link href="/buscar" aria-label="Buscar" className="p-2 transition-opacity hover:opacity-70">
              <IconoBuscar />
            </Link>
            <Link
              href="/carrito"
              aria-label={`Carrito, ${cantidad} ${cantidad === 1 ? "par" : "pares"}`}
              className="relative p-2 transition-opacity hover:opacity-70"
            >
              <IconoBolsa />
              {cantidad > 0 && (
                <span className="absolute -right-0.5 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-terracota px-1 text-[0.6875rem] font-bold text-white">
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
