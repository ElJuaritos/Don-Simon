import Link from "next/link";
import { and, count, eq, gte, inArray, sql, sum } from "drizzle-orm";
import { getDb } from "@/db";
import { mensajes, pedidos, productos, variantes } from "@/db/schema";
import { folio, formatFecha, formatPrecio, formatTalla } from "@/lib/formato";
import { BadgeEstado, Tarjeta, TituloAdmin } from "@/components/admin/ui";

const PAGADOS = ["pagado", "en_preparacion", "enviado", "entregado"] as const;

export default async function InicioAdmin() {
  const db = await getDb();
  const [[ventas], [porAtender], [sinLeer], recientes, pocoStock] = await Promise.all([
    db
      .select({ total: sum(pedidos.total), pedidos: count() })
      .from(pedidos)
      .where(and(inArray(pedidos.estado, [...PAGADOS]), gte(pedidos.pagadoEn, sql`now() - interval '30 days'`))),
    db.select({ n: count() }).from(pedidos).where(inArray(pedidos.estado, ["pagado", "en_preparacion"])),
    db.select({ n: count() }).from(mensajes).where(eq(mensajes.leido, false)),
    db.select().from(pedidos).orderBy(sql`${pedidos.createdAt} desc`).limit(6),
    db
      .select({ variante: variantes, producto: { id: productos.id, nombre: productos.nombre } })
      .from(variantes)
      .innerJoin(productos, eq(variantes.productoId, productos.id))
      .where(
        and(
          eq(productos.estado, "activo"),
          eq(variantes.activo, true),
          sql`${variantes.stock} - ${variantes.stockApartado} <= 1`,
        ),
      )
      .orderBy(productos.nombre, variantes.color, variantes.talla)
      .limit(12),
  ]);

  const indicadores = [
    { etiqueta: "Ventas (30 días)", valor: formatPrecio(Number(ventas.total ?? 0)) },
    { etiqueta: "Pedidos pagados (30 días)", valor: String(ventas.pedidos) },
    { etiqueta: "Pedidos por enviar", valor: String(porAtender.n), href: "/admin/pedidos?estado=pagado" },
    { etiqueta: "Mensajes sin leer", valor: String(sinLeer.n), href: "/admin/mensajes" },
  ];

  return (
    <>
      <TituloAdmin>Hola 👋</TituloAdmin>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {indicadores.map((i) => {
          const contenido = (
            <>
              <p className="text-sm text-cafe/85">{i.etiqueta}</p>
              <p className="mt-2 text-3xl font-semibold">{i.valor}</p>
            </>
          );
          return i.href ? (
            <Link key={i.etiqueta} href={i.href} className="border border-cafe/15 p-5 transition-colors hover:border-cafe">
              {contenido}
            </Link>
          ) : (
            <div key={i.etiqueta} className="border border-cafe/15 p-5">
              {contenido}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <Tarjeta titulo="Pedidos recientes">
          {recientes.length === 0 ? (
            <p className="text-cafe/85">Todavía no hay pedidos.</p>
          ) : (
            <ul className="divide-y divide-cafe/10">
              {recientes.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/pedidos/${p.id}`} className="flex items-center justify-between gap-4 py-3 hover:bg-crema-claro">
                    <span>
                      <span className="font-semibold">{folio(p.numero)}</span> · {p.nombre}
                      <span className="block text-sm text-cafe/85">{formatFecha(p.createdAt)}</span>
                    </span>
                    <span className="flex flex-col items-end gap-1">
                      <BadgeEstado estado={p.estado} />
                      <span className="text-sm">{formatPrecio(p.total)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>

        <Tarjeta titulo="Tallas por agotarse">
          {pocoStock.length === 0 ? (
            <p className="text-cafe/85">Todo con buen inventario.</p>
          ) : (
            <ul className="divide-y divide-cafe/10">
              {pocoStock.map(({ variante: v, producto }) => {
                const libres = v.stock - v.stockApartado;
                return (
                  <li key={v.id}>
                    <Link href={`/admin/productos/${producto.id}#inventario`} className="flex justify-between gap-4 py-2.5 hover:bg-crema-claro">
                      <span>
                        {producto.nombre} · {v.color} · {formatTalla(v.talla)}
                      </span>
                      <span className={libres <= 0 ? "font-semibold text-terracota-oscuro" : ""}>
                        {libres <= 0 ? "Agotada" : "Queda 1"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Tarjeta>
      </div>
    </>
  );
}
