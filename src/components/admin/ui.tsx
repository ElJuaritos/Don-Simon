import type { ReactNode } from "react";
import type { EstadoPedido } from "@/db/schema";

export function TituloAdmin({ children, accion }: { children: ReactNode; accion?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
      <h1 className="titulo-display text-4xl md:text-5xl">{children}</h1>
      {accion}
    </div>
  );
}

export function Tarjeta({ titulo, children, className = "" }: { titulo?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`border border-negro/15 p-5 md:p-6 ${className}`}>
      {titulo && <h2 className="etiqueta mb-5">{titulo}</h2>}
      {children}
    </section>
  );
}

export const NOMBRE_ESTADO: Record<EstadoPedido, string> = {
  pendiente_pago: "Esperando pago",
  pagado: "Pagado",
  en_preparacion: "En preparación",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
  devuelto: "Devuelto",
};

const COLOR_ESTADO: Record<EstadoPedido, string> = {
  pendiente_pago: "bg-blanco text-negro",
  pagado: "bg-pizarra text-blanco",
  en_preparacion: "bg-topo text-negro",
  enviado: "bg-negro text-blanco",
  entregado: "bg-blanco text-negro border border-negro/30",
  cancelado: "bg-blanco text-negro/70 border border-negro/15 line-through",
  devuelto: "bg-blanco text-negro/70 border border-negro/15",
};

export function BadgeEstado({ estado }: { estado: EstadoPedido }) {
  return (
    <span className={`inline-block whitespace-nowrap px-2.5 py-1 text-xs font-semibold ${COLOR_ESTADO[estado]}`}>
      {NOMBRE_ESTADO[estado]}
    </span>
  );
}
