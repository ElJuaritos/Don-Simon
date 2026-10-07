"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { marca } from "@/config/marca";
import { IconoCorreo, IconoWhatsapp } from "@/components/ui/iconos";

/**
 * Botón fijo de ayuda. Se esconde al llegar a la franja legal del footer
 * y en la ficha de producto, para no tapar «Comprar ahora».
 */
export function BotonAyuda() {
  const [abierto, setAbierto] = useState(false);
  const [sobreFooter, setSobreFooter] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const pathname = usePathname();
  const enFicha = pathname.startsWith("/producto/");
  const textoWhatsapp = encodeURIComponent(`Hola, tengo una pregunta sobre ${marca.nombre}.`);

  useEffect(() => {
    const franja = document.getElementById("franja-legal");
    if (!franja) return;
    const observer = new IntersectionObserver(([entrada]) => {
      setSobreFooter(entrada.isIntersecting);
      if (entrada.isIntersecting) setAbierto(false);
    });
    observer.observe(franja);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAbierto(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [abierto]);

  if (sobreFooter || enFicha) return null;

  return (
    <div ref={ref} className="fixed right-4 bottom-4 z-30">
      {abierto && (
        <div id={panelId} role="region" aria-label="Opciones de ayuda" className="mb-2 w-64 border border-cafe/15 bg-hueso p-2">
          <ul>
            {marca.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${marca.whatsapp}?text=${textoWhatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-2 px-3 text-sm hover:bg-arena"
                >
                  <IconoWhatsapp />
                  WhatsApp
                </a>
              </li>
            )}
            {marca.email && (
              <li>
                <a href={`mailto:${marca.email}`} className="flex min-h-11 items-center gap-2 px-3 text-sm hover:bg-arena">
                  <IconoCorreo />
                  Correo
                </a>
              </li>
            )}
            <li>
              <Link href="/ayuda/preguntas-frecuentes" className="flex min-h-11 items-center px-3 text-sm hover:bg-arena">
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </div>
      )}
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls={panelId}
        onClick={() => setAbierto((v) => !v)}
        className="border border-cafe/20 bg-hueso px-4 py-3 text-sm font-medium text-cafe"
      >
        ¿Necesitas ayuda?
      </button>
    </div>
  );
}
