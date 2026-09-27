import type { Metadata } from "next";
import Link from "next/link";
import { ESTADOS_PEDIDO, type EstadoPedido } from "@/db/schema";
import { listarPedidos } from "@/lib/data/pedidos";
import { folio, formatFecha, formatPrecio } from "@/lib/formato";
import { BadgeEstado, NOMBRE_ESTADO, TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Pedidos" };

export default async function PedidosAdmin({ searchParams }: PageProps<"/admin/pedidos">) {
  const sp = await searchParams;
  const estado = ESTADOS_PEDIDO.includes(sp.estado as EstadoPedido) ? (sp.estado as EstadoPedido) : undefined;
  const lista = await listarPedidos(estado);

  return (
    <>
      <TituloAdmin>Pedidos</TituloAdmin>
      <nav aria-label="Filtrar por estado" className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/pedidos"
          className={`px-3 py-1.5 text-sm font-semibold ${!estado ? "bg-cafe text-crema-claro" : "border border-cafe/20 hover:border-cafe"}`}
        >
          Todos
        </Link>
        {ESTADOS_PEDIDO.map((e) => (
          <Link
            key={e}
            href={`/admin/pedidos?estado=${e}`}
            className={`px-3 py-1.5 text-sm font-semibold ${estado === e ? "bg-cafe text-crema-claro" : "border border-cafe/20 hover:border-cafe"}`}
          >
            {NOMBRE_ESTADO[e]}
          </Link>
        ))}
      </nav>

      {lista.length === 0 ? (
        <p className="text-cafe/85">No hay pedidos {estado ? `con estado "${NOMBRE_ESTADO[estado]}"` : "todavía"}.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-[0.9375rem]">
            <thead>
              <tr className="border-b border-cafe/20 text-sm">
                <th className="py-3 pr-4 font-semibold">Folio</th>
                <th className="py-3 pr-4 font-semibold">Fecha</th>
                <th className="py-3 pr-4 font-semibold">Cliente</th>
                <th className="py-3 pr-4 font-semibold">Total</th>
                <th className="py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((p) => (
                <tr key={p.id} className="border-b border-cafe/10 hover:bg-crema-claro">
                  <td className="py-3 pr-4">
                    <Link href={`/admin/pedidos/${p.id}`} className="font-semibold hover:underline">
                      {folio(p.numero)}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-sm">{formatFecha(p.createdAt)}</td>
                  <td className="py-3 pr-4">{p.nombre}</td>
                  <td className="py-3 pr-4">{formatPrecio(p.total)}</td>
                  <td className="py-3">
                    <BadgeEstado estado={p.estado} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
