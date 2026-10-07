import type { EstadoPedido } from "@/db/schema";

/** Mensaje único cuando el folio y el correo no coinciden. No dice si el folio existe. */
export const MENSAJE_PEDIDO_NO = "No encontramos un pedido con ese folio y correo.";

export const MENSAJE_LIMITE = "Hiciste muchos intentos. Espera unos minutos y vuelve a intentar.";

export const MOTIVOS_DEVOLUCION = [
  { valor: "cambio_talla", texto: "Cambio de talla" },
  { valor: "defecto", texto: "Defecto" },
  { valor: "no_me_gusto", texto: "No me gustó" },
  { valor: "otro", texto: "Otro" },
] as const;

export type MotivoDevolucion = (typeof MOTIVOS_DEVOLUCION)[number]["valor"];

export const PASOS_RASTREO: { estado: EstadoPedido; texto: string }[] = [
  { estado: "pagado", texto: "Pagado" },
  { estado: "en_preparacion", texto: "En preparación" },
  { estado: "enviado", texto: "Enviado" },
  { estado: "entregado", texto: "Entregado" },
];

const NOMBRE: Record<EstadoPedido, string> = {
  pendiente_pago: "Esperando el pago",
  pagado: "Pagado",
  en_preparacion: "En preparación",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
  devuelto: "Devuelto",
};

export function nombreEstadoPedido(estado: EstadoPedido) {
  return NOMBRE[estado];
}
