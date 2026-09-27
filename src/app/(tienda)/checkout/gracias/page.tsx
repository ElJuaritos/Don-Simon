import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { getPedido } from "@/lib/data/pedidos";
import { folio, formatPrecio, formatTalla } from "@/lib/formato";
import { VaciarCarrito } from "./vaciar-carrito";

export const metadata: Metadata = { title: "Gracias por tu compra", robots: { index: false } };

export default async function Gracias({ searchParams }: PageProps<"/checkout/gracias">) {
  const sp = await searchParams;
  const id = z.uuid().safeParse(sp.pedido);
  if (!id.success) notFound();
  const pedido = await getPedido(id.data);
  if (!pedido) notFound();

  const pagado = pedido.estado !== "pendiente_pago" && pedido.estado !== "cancelado";

  return (
    <div className="contenedor max-w-2xl py-16 text-center md:py-24">
      <VaciarCarrito />
      <p className="etiqueta text-terracota-oscuro">Pedido {folio(pedido.numero)}</p>
      <h1 className="titulo-display mt-3 text-5xl md:text-6xl">Gracias, {pedido.nombre.split(" ")[0]}</h1>
      <p className="mt-6 text-lg">
        {pagado
          ? "Recibimos tu pago. Te avisaremos cuando tu pedido vaya en camino."
          : sp.demo
            ? "Registramos tu pedido en modo demo (sin cobro)."
            : "Estamos confirmando tu pago. Si pagaste con OXXO o transferencia, se confirma cuando llegue el depósito."}
      </p>
      {/* TODO: correo de confirmación con Resend (fase 4) */}
      <p className="mt-2 text-sm text-cafe/85">Guarda tu número de pedido para cualquier aclaración.</p>

      <ul className="mt-10 divide-y divide-cafe/10 border-y border-cafe/10 text-left">
        {pedido.lineas.map((l) => (
          <li key={l.id} className="flex justify-between gap-4 py-4">
            <span>
              {l.cantidad} × {l.nombreProducto}
              <span className="block text-sm text-cafe/85">
                {l.color} · Talla {formatTalla(l.talla)}
              </span>
            </span>
            <span>{formatPrecio(l.precioUnitario * l.cantidad)}</span>
          </li>
        ))}
        <li className="flex justify-between py-4 font-semibold">
          <span>Total</span>
          <span>{formatPrecio(pedido.total)}</span>
        </li>
      </ul>

      <Link href="/coleccion" className="btn-contorno mt-10">
        Seguir explorando
      </Link>
    </div>
  );
}
