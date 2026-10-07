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
 * Header fijo. Se queda visible al bajar (no se esconde).
 * En computadora: páginas a la izquierda, logo al centro, ayuda y cuenta a la derecha.
 * En celular: menú, logo, buscar y carrito.
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
      className="sticky top-0 z-40 border-b border-cafe/10 bg-hueso/95 backdrop-blur supports-[backdrop-filter]:bg-hueso/85"
      onMouseEnter={cancelarCierre}
      onMouseLeave={programarCierre}
      onBlur={(e) => {
        const siguiente = e.relatedTarget;
        if (!(siguiente instanceof Node) || !e.currentTarget.contains(siguiente)) programarCierre();
      }}
    >
      <div className="contenedor grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-[4.75rem]">
        <nav aria-label="Tienda" className="flex min-w-0 items-center gap-5 xl:gap-7">
          <MenuMovil entradas={entradas} />
          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {entradas.map((e) =>
              e.tipo === "enlace" ? (
                <Link
                  key={e.id}
                  href={e.href}
                  className="texto-nav py-7 whitespace-nowrap transition-opacity hover:opacity-60"
                  aria-current={pathname === e.href ? "page" : undefined}
                >
                  {e.texto}
                </Link>
              ) : (
                <Link
                  key={e.id}
                  href={e.href}
                  className="texto-nav py-7 whitespace-nowrap transition-opacity hover:opacity-60"
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
              ),
            )}
          </div>
        </nav>

        <Link href="/" aria-label="Inicio" className="text-[1.9rem] lg:text-[2.4rem]">
          <Logo />
        </Link>

        <div className="flex items-center justify-end gap-1 sm:gap-3 lg:gap-4">
          <Link href="/ayuda/guia-de-tallas" className="texto-nav hidden py-7 whitespace-nowrap transition-opacity hover:opacity-60 lg:block">
            Guía de tallas
          </Link>
          <Link href="/ayuda" className="texto-nav hidden py-7 whitespace-nowrap transition-opacity hover:opacity-60 lg:block">
            Ayuda
          </Link>
          <Link href="/cuenta" aria-label="Tu cuenta" className="hidden p-2 transition-opacity hover:opacity-60 lg:block">
            <IconoPersona />
          </Link>
          <Link href="/buscar" aria-label="Buscar" className="p-2 transition-opacity hover:opacity-60">
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
            className="relative -mr-2 p-2 transition-opacity hover:opacity-60"
          >
            <IconoBolsa />
            {cantidad > 0 && (
              <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-cafe px-1 text-[0.6875rem] font-bold text-crema-claro">
                {cantidad}
              </span>
            )}
          </Link>
        </div>
      </div>
      {menu && <PanelMega menu={menu} />}
    </header>
  );
}
