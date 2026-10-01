import type { Orden } from "@/lib/data/catalogo";

// Separado del formulario de filtros (componente de cliente) para que el servidor también lo use.
export const ORDENES: { valor: Orden; texto: string }[] = [
  { valor: "destacados", texto: "Destacados" },
  { valor: "novedades", texto: "Novedades" },
  { valor: "precio-asc", texto: "Precio: menor a mayor" },
  { valor: "precio-desc", texto: "Precio: mayor a menor" },
];
