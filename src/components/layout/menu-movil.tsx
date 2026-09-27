"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconoCerrar, IconoMenu } from "@/components/ui/iconos";
import { Logo } from "@/components/ui/logo";

export function MenuMovil({
  enlaces,
  categorias,
}: {
  enlaces: { href: string; texto: string }[];
  categorias: { nombre: string; slug: string }[];
}) {
  const [abierto, setAbierto] = useState(false);
  const pathname = usePathname();

  // Cierra el menú al navegar
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
        <div className="absolute inset-0 bg-cafe-oscuro/40" onClick={() => setAbierto(false)} />
        <nav
          aria-label="Menú"
          className={`absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-crema-claro px-6 py-5 transition-transform duration-500 ease-suave ${abierto ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl">
              <Logo />
            </span>
            <button type="button" onClick={() => setAbierto(false)} aria-label="Cerrar menú" className="-mr-2 p-2">
              <IconoCerrar />
            </button>
          </div>
          <p className="etiqueta mt-10 text-cafe/85">Colección</p>
          <ul className="mt-3 space-y-1">
            {categorias.map((c) => (
              <li key={c.slug}>
                <Link href={`/coleccion/${c.slug}`} className="titulo-display block py-1.5 text-3xl" tabIndex={abierto ? 0 : -1}>
                  {c.nombre}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/coleccion" className="titulo-display block py-1.5 text-3xl" tabIndex={abierto ? 0 : -1}>
                Ver todo
              </Link>
            </li>
          </ul>
          <ul className="mt-auto space-y-3 border-t border-cafe/15 pt-6">
            {enlaces.slice(1).map((e) => (
              <li key={e.href}>
                <Link href={e.href} className="etiqueta" tabIndex={abierto ? 0 : -1}>
                  {e.texto}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contacto" className="etiqueta" tabIndex={abierto ? 0 : -1}>
                Contacto
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
