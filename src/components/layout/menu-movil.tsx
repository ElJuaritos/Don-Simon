"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconoCerrar, IconoMenu, IconoPersona } from "@/components/ui/iconos";
import { Logo } from "@/components/ui/logo";
import type { EntradaNav } from "./navegacion";

/** Menú del celular. Hombre, Mujer y Nosotros se abren como acordeones, sin las fotos. */
export function MenuMovil({ entradas }: { entradas: EntradaNav[] }) {
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
    <div className="lg:hidden">
      <button type="button" onClick={() => setAbierto(true)} aria-label="Abrir menú" aria-expanded={abierto} className="-ml-2 p-2">
        <IconoMenu />
      </button>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${abierto ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!abierto}
      >
        <div className="absolute inset-0 bg-negro/40" onClick={cerrar} />
        <nav
          aria-label="Menú"
          className={`absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col overflow-y-auto bg-blanco px-6 py-5 transition-transform duration-500 ease-suave ${abierto ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <span>
              <Logo />
            </span>
            <button type="button" onClick={cerrar} aria-label="Cerrar menú" className="-mr-2 p-2">
              <IconoCerrar />
            </button>
          </div>

          <ul className="mt-8 divide-y divide-negro/10 border-y border-negro/10">
            {entradas.map((e) => (
              <li key={e.id}>
                {e.tipo === "enlace" ? (
                  <Link href={e.href} onClick={cerrar} className="block py-3 text-lg font-medium" tabIndex={tab}>
                    {e.texto}
                  </Link>
                ) : (
                  <details className="group">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between py-3 text-lg font-medium [&::-webkit-details-marker]:hidden">
                      {e.texto}
                      <span className="text-negro/70 group-open:hidden" aria-hidden>
                        +
                      </span>
                      <span className="hidden text-negro/70 group-open:inline" aria-hidden>
                        −
                      </span>
                    </summary>
                    <div className="space-y-5 pb-4">
                      {e.columnas.map((col) => (
                        <div key={col.titulo}>
                          <p className="etiqueta text-negro/85">{col.titulo}</p>
                          <ul className="mt-2 space-y-1">
                            {col.enlaces.map((enlace) => (
                              <li key={`${col.titulo}-${enlace.texto}`}>
                                <Link href={enlace.href} onClick={cerrar} className="block py-1.5" tabIndex={tab}>
                                  {enlace.texto}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </li>
            ))}
          </ul>

          <Link href="/cuenta" onClick={cerrar} className="mt-6 flex items-center gap-2 py-2 text-lg font-medium" tabIndex={tab}>
            <IconoPersona />
            Tu cuenta
          </Link>
          <Link href="/ayuda" onClick={cerrar} className="block py-2" tabIndex={tab}>
            Ayuda
          </Link>
        </nav>
      </div>
    </div>
  );
}
