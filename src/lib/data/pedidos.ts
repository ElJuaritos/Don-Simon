import "server-only";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  pedidoLineas,
  pedidos,
  variantes,
  type DireccionEnvio,
  type EstadoPedido,
} from "@/db/schema";
import type { LineaCarrito } from "@/lib/carrito";

// Flujo de inventario (docs/05-stack-tecnico.md):
// 1. Al crear el pedido se APARTAN los pares (stock_apartado += cantidad).
// 2. Cuando Stripe confirma el pago, se descuentan (stock -= cantidad, apartado -= cantidad).
// 3. Si el pago vence o falla, se liberan (apartado -= cantidad).

export class SinStockError extends Error {
  constructor(public linea: Pick<LineaCarrito, "nombre" | "color" | "talla">) {
    super(`Ya no hay suficientes pares de ${linea.nombre} (${linea.color}, talla ${linea.talla}).`);
  }
}

export async function crearPedido(datos: {
  email: string;
  nombre: string;
  telefono: string;
  direccion: DireccionEnvio;
  notas: string;
  lineas: LineaCarrito[];
  subtotal: number;
  envio: number;
  total: number;
}) {
  const db = await getDb();
  return db.transaction(async (tx) => {
    for (const l of datos.lineas) {
      const apartada = await tx
        .update(variantes)
        .set({ stockApartado: sql`${variantes.stockApartado} + ${l.cantidad}` })
        .where(
          and(
            eq(variantes.id, l.varianteId),
            eq(variantes.activo, true),
            gte(sql`${variantes.stock} - ${variantes.stockApartado}`, l.cantidad),
          ),
        )
        .returning({ id: variantes.id });
      if (apartada.length === 0) throw new SinStockError(l);
    }

    const [pedido] = await tx
      .insert(pedidos)
      .values({
        email: datos.email,
        nombre: datos.nombre,
        telefono: datos.telefono,
        direccion: datos.direccion,
        notas: datos.notas,
        subtotal: datos.subtotal,
        envio: datos.envio,
        total: datos.total,
      })
      .returning();

    await tx.insert(pedidoLineas).values(
      datos.lineas.map((l) => ({
        pedidoId: pedido.id,
        varianteId: l.varianteId,
        nombreProducto: l.nombre,
        color: l.color,
        talla: l.talla,
        sku: l.sku,
        precioUnitario: l.precioUnitario,
        cantidad: l.cantidad,
      })),
    );
    return pedido;
  });
}

async function moverInventario(
  pedidoId: string,
  de: EstadoPedido,
  a: EstadoPedido,
  extra: Partial<typeof pedidos.$inferInsert>,
  descontarStock: boolean,
) {
  const db = await getDb();
  return db.transaction(async (tx) => {
    // El filtro por estado hace la operación idempotente: Stripe puede reenviar el webhook.
    const [pedido] = await tx
      .update(pedidos)
      .set({ estado: a, ...extra })
      .where(and(eq(pedidos.id, pedidoId), eq(pedidos.estado, de)))
      .returning();
    if (!pedido) return null;

    const lineas = await tx.select().from(pedidoLineas).where(eq(pedidoLineas.pedidoId, pedidoId));
    for (const l of lineas) {
      if (!l.varianteId) continue;
      await tx
        .update(variantes)
        .set({
          stockApartado: sql`greatest(${variantes.stockApartado} - ${l.cantidad}, 0)`,
          ...(descontarStock ? { stock: sql`greatest(${variantes.stock} - ${l.cantidad}, 0)` } : {}),
        })
        .where(eq(variantes.id, l.varianteId));
    }
    return pedido;
  });
}

/** Solo debe llamarse desde el webhook verificado de Stripe */
export function confirmarPago(pedidoId: string, metodoPago: string | null) {
  return moverInventario(
    pedidoId,
    "pendiente_pago",
    "pagado",
    { pagadoEn: new Date(), metodoPago },
    true,
  );
}

export function cancelarPedidoPendiente(pedidoId: string) {
  return moverInventario(pedidoId, "pendiente_pago", "cancelado", {}, false);
}

/**
 * Llegó un pago para un pedido que ya no espera pago (por ejemplo, se canceló y el
 * depósito de OXXO llegó después). No se toca el inventario; se deja una nota para
 * que el dueño lo revise y haga el reembolso desde Stripe.
 */
export async function registrarPagoTardio(pedidoId: string) {
  const db = await getDb();
  const [pedido] = await db
    .update(pedidos)
    .set({
      notas: sql`trim(${pedidos.notas} || ' [Aviso] Llegó un pago cuando el pedido ya estaba cancelado: revisa y reembolsa desde Stripe.')`,
    })
    .where(and(eq(pedidos.id, pedidoId), eq(pedidos.estado, "cancelado")))
    .returning({ id: pedidos.id });
  if (pedido) console.error(`Pago recibido para el pedido cancelado ${pedidoId}`);
}

export async function getPedido(id: string) {
  const db = await getDb();
  const [pedido] = await db.select().from(pedidos).where(eq(pedidos.id, id));
  if (!pedido) return null;
  const lineas = await db.select().from(pedidoLineas).where(eq(pedidoLineas.pedidoId, pedido.id));
  return { ...pedido, lineas };
}

export async function listarPedidos(estado?: EstadoPedido) {
  const db = await getDb();
  return db
    .select()
    .from(pedidos)
    .where(estado ? eq(pedidos.estado, estado) : undefined)
    .orderBy(desc(pedidos.createdAt))
    .limit(200);
}
