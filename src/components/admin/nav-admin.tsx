"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ENLACES = [
  { href: "/admin", texto: "Inicio" },
  { href: "/admin/productos", texto: "Productos" },
  { href: "/admin/pedidos", texto: "Pedidos" },
  { href: "/admin/categorias", texto: "Categorías" },
  { href: "/admin/mensajes", texto: "Mensajes" },
];

export function NavAdmin() {
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
          </Link>
        );
      })}
    </nav>
  );
}
