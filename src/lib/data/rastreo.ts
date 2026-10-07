import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { pedidoLineas, pedidos, type EstadoPedido } from "@/db/schema";
import { folio, formatTalla, numeroDeFolio } from "@/lib/formato";

export type LineaPublica = { etiqueta: string };

export type PedidoPublico = {
  id: string;
  folio: string;
  fecha: Date;
  estado: EstadoPedido;
  paqueteria: string | null;
  numeroGuia: string | null;
  lineas: LineaPublica[];
};

/**
 * Busca un pedido por folio y correo. Si no coinciden, devuelve null
 * sin decir cuál de los dos falló. No incluye nombre, teléfono ni dirección.
 */
export async function buscarPedidoPublico(folioTexto: string, email: string): Promise<PedidoPublico | null> {
  const numero = numeroDeFolio(folioTexto);
  const correo = email.trim().toLowerCase();
  if (numero == null || !correo) return null;

  const db = await getDb();
  const [pedido] = await db
    .select({
      id: pedidos.id,
      numero: pedidos.numero,
      email: pedidos.email,
      estado: pedidos.estado,
      createdAt: pedidos.createdAt,
      paqueteria: pedidos.paqueteria,
      numeroGuia: pedidos.numeroGuia,
    })
    .from(pedidos)
    .where(eq(pedidos.numero, numero));

  if (!pedido || pedido.email.trim().toLowerCase() !== correo) return null;

  const lineas = await db
    .select({
      nombreProducto: pedidoLineas.nombreProducto,
      color: pedidoLineas.color,
      talla: pedidoLineas.talla,
      cantidad: pedidoLineas.cantidad,
    })
    .from(pedidoLineas)
    .where(eq(pedidoLineas.pedidoId, pedido.id));

  return {
    id: pedido.id,
    folio: folio(pedido.numero),
    fecha: pedido.createdAt,
    estado: pedido.estado,
    paqueteria: pedido.paqueteria,
    numeroGuia: pedido.numeroGuia,
    lineas: lineas.map((l) => ({
      etiqueta: `${l.cantidad > 1 ? `${l.cantidad} × ` : ""}${l.nombreProducto} · ${l.color} · Talla ${formatTalla(l.talla)}`,
    })),
  };
}
