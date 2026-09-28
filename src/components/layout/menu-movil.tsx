"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconoCerrar, IconoMenu } from "@/components/ui/iconos";
import { Logo } from "@/components/ui/logo";
import { LA_CASA, TIENDA_PUBLICO, type Enlace } from "./navegacion";

/** Menú lateral del celular. Se cierra al navegar, con Escape o tocando fuera. */
export function MenuMovil({ categorias }: { categorias: Enlace[] }) {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  const [rutaPrevia, setRutaPrevia] = useState(pathname);
  if (pathname !== rutaPrevia) {
    setRutaPrevia(pathname);
    setAbierto(false);
  }

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto]);

  const tab = abierto ? 0 : -1;
  const cerrar = () => setAbierto(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir menú"
        aria-expanded={abierto}
        className="-ml-2 p-2"
      >
        <IconoMenu />
      </button>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${abierto ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!abierto}
      >
        <div className="absolute inset-0 bg-cafe-oscuro/40" onClick={cerrar} />
        <nav
          aria-label="Menú"
          className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-hueso px-6 py-5 transition-transform duration-500 ease-suave ${abierto ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl">
              <Logo />
            </span>
            <button type="button" onClick={cerrar} aria-label="Cerrar menú" className="-mr-2 p-2">
              <IconoCerrar />
            </button>
          </div>

          <ul className="mt-10 space-y-1">
            {TIENDA_PUBLICO.map((e) => (
              <li key={e.href}>
                {/* El filtro va en la URL: cambia solo la consulta, así que se cierra a mano */}
                <Link href={e.href} onClick={cerrar} className="titulo-display block py-1 text-4xl" tabIndex={tab}>
                  {e.texto}
                </Link>
              </li>
            ))}
          </ul>

          <p className="etiqueta mt-10 text-cafe/85">Colección</p>
          <ul className="mt-3 divide-y divide-cafe/10 border-y border-cafe/10">
            {categorias.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="block py-3" tabIndex={tab}>
                  {c.texto}
                </Link>
              </li>
            ))}
          </ul>

          <p className="etiqueta mt-10 text-cafe/85">La casa</p>
          <ul className="mt-3 space-y-3">
            {[...LA_CASA, { href: "/ayuda", texto: "Ayuda" }, { href: "/contacto", texto: "Contacto" }].map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="block" tabIndex={tab}>
                  {e.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
