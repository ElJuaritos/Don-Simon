import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { cambiarEstadoPedido } from "@/lib/actions/admin";
import { getPedido } from "@/lib/data/pedidos";
import { folio, formatFecha, formatPrecio, formatTalla } from "@/lib/formato";
import { FormAdmin } from "@/components/admin/form-admin";
import { BadgeEstado, Tarjeta, TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Pedido" };

export default async function PedidoAdmin({ params }: PageProps<"/admin/pedidos/[id]">) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const pedido = await getPedido(id);
  if (!pedido) notFound();
  const d = pedido.direccion;

  return (
    <>
      <Link href="/admin/pedidos" className="enlace text-sm">
        ← Pedidos
      </Link>
      <div className="mt-3">
        <TituloAdmin accion={<BadgeEstado estado={pedido.estado} />}>{folio(pedido.numero)}</TituloAdmin>
      </div>

      <div className="grid max-w-6xl gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Tarjeta titulo="Productos">
            <ul className="divide-y divide-cafe/10">
              {pedido.lineas.map((l) => (
                <li key={l.id} className="flex justify-between gap-4 py-3">
                  <span>
                    <span className="font-semibold">
                      {l.cantidad} × {l.nombreProducto}
                    </span>
                    <span className="block text-sm text-cafe/85">
                      {l.color} · Talla {formatTalla(l.talla)} · SKU {l.sku}
                    </span>
                  </span>
                  <span>{formatPrecio(l.precioUnitario * l.cantidad)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 border-t border-cafe/15 pt-4 text-[0.9375rem]">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrecio(pedido.subtotal)}</dd></div>
              <div className="flex justify-between"><dt>Envío</dt><dd>{pedido.envio ? formatPrecio(pedido.envio) : "Gratis"}</dd></div>
              <div className="flex justify-between text-lg font-semibold"><dt>Total</dt><dd>{formatPrecio(pedido.total)}</dd></div>
            </dl>
          </Tarjeta>

          <Tarjeta titulo="Siguiente paso">
            <SiguientePaso pedidoId={pedido.id} estado={pedido.estado} />
          </Tarjeta>
        </div>

        <div className="space-y-6">
          <Tarjeta titulo="Cliente">
            <p className="font-semibold">{pedido.nombre}</p>
            <p><a href={`mailto:${pedido.email}`} className="enlace">{pedido.email}</a></p>
            <p><a href={`tel:${pedido.telefono}`} className="enlace">{pedido.telefono}</a></p>
          </Tarjeta>
          <Tarjeta titulo="Envío">
            <address className="not-italic">
              {d.calle} {d.numeroExt}{d.numeroInt ? ` int. ${d.numeroInt}` : ""}<br />
              {d.colonia}, C.P. {d.codigoPostal}<br />
              {d.ciudad}, {d.estado}
              {d.referencias && <><br /><span className="text-sm text-cafe/85">Ref.: {d.referencias}</span></>}
            </address>
            {pedido.numeroGuia && (
              <p className="mt-3 text-sm">
                <strong>{pedido.paqueteria}</strong> · Guía {pedido.numeroGuia}
              </p>
            )}
          </Tarjeta>
          <Tarjeta titulo="Detalles">
            <dl className="space-y-1 text-sm">
              <div><dt className="inline font-semibold">Creado: </dt><dd className="inline">{formatFecha(pedido.createdAt)}</dd></div>
              {pedido.pagadoEn && <div><dt className="inline font-semibold">Pagado: </dt><dd className="inline">{formatFecha(pedido.pagadoEn)}{pedido.metodoPago && ` (${pedido.metodoPago})`}</dd></div>}
              {pedido.enviadoEn && <div><dt className="inline font-semibold">Enviado: </dt><dd className="inline">{formatFecha(pedido.enviadoEn)}</dd></div>}
              {pedido.stripeSessionId && <div><dt className="inline font-semibold">Stripe: </dt><dd className="inline break-all">{pedido.stripeSessionId}</dd></div>}
            </dl>
            {pedido.notas && <p className="mt-3 bg-crema-claro px-3 py-2 text-sm"><strong>Nota del cliente:</strong> {pedido.notas}</p>}
          </Tarjeta>
        </div>
      </div>
    </>
  );
}

function SiguientePaso({ pedidoId, estado }: { pedidoId: string; estado: string }) {
  const Oculto = <input type="hidden" name="id" value={pedidoId} />;
  switch (estado) {
    case "pendiente_pago":
      return (
        <>
          <p className="text-[0.9375rem]">
            Esperando la confirmación de Stripe. Se marca como <em>pagado</em> automáticamente. Si el cliente no paga, se cancela solo cuando vence el pago.
          </p>
          <FormAdmin action={cambiarEstadoPedido} boton="Cancelar pedido" botonClase="btn-contorno">
            {Oculto}
            <input type="hidden" name="estado" value="cancelado" />
          </FormAdmin>
        </>
      );
    case "pagado":
      return (
        <FormAdmin action={cambiarEstadoPedido} boton="Empezar a preparar">
          {Oculto}
          <input type="hidden" name="estado" value="en_preparacion" />
          <p className="text-[0.9375rem]">El pago está confirmado. Prepara el paquete.</p>
        </FormAdmin>
      );
    case "en_preparacion":
      return (
        <FormAdmin action={cambiarEstadoPedido} boton="Marcar como enviado">
          {Oculto}
          <input type="hidden" name="estado" value="enviado" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="campo-label">Paquetería</span>
              <input name="paqueteria" required list="paqueterias" className="campo" />
              <datalist id="paqueterias">
                {["Estafeta", "DHL", "FedEx", "99minutos", "Paquetexpress", "Redpack"].map((p) => <option key={p} value={p} />)}
              </datalist>
            </label>
            <label className="block">
              <span className="campo-label">Número de guía</span>
              <input name="numeroGuia" required className="campo" />
            </label>
          </div>
        </FormAdmin>
      );
    case "enviado":
      return (
        <FormAdmin action={cambiarEstadoPedido} boton="Marcar como entregado">
          {Oculto}
          <input type="hidden" name="estado" value="entregado" />
          <p className="text-[0.9375rem]">Cuando la paquetería confirme la entrega, márcalo como entregado.</p>
        </FormAdmin>
      );
    case "entregado":
      return (
        <FormAdmin action={cambiarEstadoPedido} boton="Registrar devolución" botonClase="btn-contorno">
          {Oculto}
          <input type="hidden" name="estado" value="devuelto" />
          <p className="text-[0.9375rem]">Pedido completado. Si el cliente lo devuelve, regístralo aquí (el reembolso se hace desde Stripe).</p>
        </FormAdmin>
      );
    default:
      return <p className="text-[0.9375rem]">Este pedido está cerrado.</p>;
  }
}
