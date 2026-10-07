"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { href: "/admin", texto: "Inicio" },
  { href: "/admin/productos", texto: "Productos" },
  { href: "/admin/pedidos", texto: "Pedidos" },
  { href: "/admin/resenas", texto: "Reseñas" },
  { href: "/admin/contenido", texto: "Textos y fotos" },
  { href: "/admin/lookbook", texto: "Lookbook" },
  { href: "/admin/categorias", texto: "Categorías" },
  { href: "/admin/hormas", texto: "Hormas" },
  { href: "/admin/mensajes", texto: "Mensajes" },
];

export function NavAdmin({ pendientes = 0 }: { pendientes?: number }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Panel" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3 md:pb-0">
      {ENLACES.map((e) => {
        const activo = e.href === "/admin" ? pathname === "/admin" : pathname.startsWith(e.href);
        return (
          <Link
            key={e.href}
            href={e.href}
            aria-current={activo ? "page" : undefined}
            className={`whitespace-nowrap rounded-[2px] px-3 py-2.5 text-[0.9375rem] font-semibold transition-colors ${
              activo ? "bg-cafe text-crema-claro" : "hover:bg-crema"
            }`}
          >
            {e.texto}
            {e.href === "/admin/resenas" && pendientes > 0 && (
              <span className="ml-2 inline-grid min-w-5 place-items-center bg-terracota px-1 text-xs text-white">{pendientes}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
