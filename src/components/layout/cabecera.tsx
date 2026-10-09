"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCarrito } from "@/components/cart/proveedor-carrito";
import { IconoBolsa, IconoBuscar, IconoPersona } from "@/components/ui/iconos";
import { Logo } from "@/components/ui/logo";
import { MenuMovil } from "./menu-movil";
import type { EntradaNav } from "./navegacion";
import { PanelMega } from "./panel-mega";

/**
 * Header. En celular: menú, logotipo y acciones.
 * En escritorio: logotipo centrado y, debajo, la barra negra del menú.
 */
export function Cabecera({ entradas }: { entradas: EntradaNav[] }) {
  const { carrito, abrir } = useCarrito();
  const cantidad = carrito.cantidad;
  const [abierto, setAbierto] = useState<string | null>(null);
  const cerrarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  const [rutaPrevia, setRutaPrevia] = useState(pathname);
  if (pathname !== rutaPrevia) {
    setRutaPrevia(pathname);
    setAbierto(null);
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const cancelarCierre = () => {
    if (cerrarTimer.current) clearTimeout(cerrarTimer.current);
  };
  const programarCierre = () => {
    cancelarCierre();
    cerrarTimer.current = setTimeout(() => setAbierto(null), 150);
  };

  const menu = entradas.find((e): e is Extract<EntradaNav, { tipo: "menu" }> => e.tipo === "menu" && e.id === abierto);

  return (
    <header
      className="relative bg-blanco"
      onMouseEnter={cancelarCierre}
      onMouseLeave={programarCierre}
      onBlur={(e) => {
        const siguiente = e.relatedTarget;
        if (!(siguiente instanceof Node) || !e.currentTarget.contains(siguiente)) programarCierre();
      }}
    >
      <div className="contenedor grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-14">
        <div className="flex items-center">
          <MenuMovil entradas={entradas} />
        </div>

        <Link href="/" aria-label="Inicio" className="justify-self-center">
          <Logo priority />
        </Link>

        <div className="flex items-center justify-end gap-1 sm:gap-3 lg:gap-4">
          <Link href="/ayuda/guia-de-tallas" className="texto-nav hidden whitespace-nowrap hover:opacity-70 lg:block">
            Guía de tallas
          </Link>
          <Link href="/ayuda" className="texto-nav hidden whitespace-nowrap hover:opacity-70 lg:block">
            Ayuda
          </Link>
          <Link href="/cuenta" aria-label="Tu cuenta" className="hidden p-2 hover:opacity-70 lg:block">
            <IconoPersona />
          </Link>
          <Link href="/buscar" aria-label="Buscar" className="p-2 hover:opacity-70">
            <IconoBuscar />
          </Link>
          <Link
            href="/carrito"
            aria-label={`Carrito, ${cantidad} ${cantidad === 1 ? "par" : "pares"}`}
            aria-haspopup="dialog"
            onClick={(e) => {
              e.preventDefault();
              abrir();
            }}
            className="relative -mr-2 p-2 hover:opacity-70"
          >
            <IconoBolsa />
            {cantidad > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-negro px-1 text-[0.6875rem] font-bold text-blanco">
                {cantidad}
              </span>
            )}
          </Link>
        </div>
      </div>

      <nav aria-label="Tienda" className="foco-claro hidden h-10 bg-negro text-blanco lg:block">
        <ul className="contenedor flex h-full items-center justify-evenly">
          {entradas.map((e) => (
            <li key={e.id}>
              {e.tipo === "enlace" ? (
                <Link
                  href={e.href}
                  className="texto-nav inline-block py-2 whitespace-nowrap hover:text-blanco/80"
                  aria-current={pathname === e.href ? "page" : undefined}
                >
                  {e.texto}
                </Link>
              ) : (
                <Link
                  href={e.href}
                  className="texto-nav inline-block py-2 whitespace-nowrap hover:text-blanco/80"
                  aria-expanded={abierto === e.id}
                  aria-controls={`mega-${e.id}`}
                  onMouseEnter={() => {
                    cancelarCierre();
                    setAbierto(e.id);
                  }}
                  onFocus={() => setAbierto(e.id)}
                >
                  {e.texto}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
      {menu && <PanelMega menu={menu} />}
    </header>
  );
}
