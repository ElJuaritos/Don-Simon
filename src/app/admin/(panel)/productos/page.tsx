import type { Metadata } from "next";
import Link from "next/link";
import { asc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { categorias, productos, variantes } from "@/db/schema";
import { formatPrecio } from "@/lib/formato";
import { TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Productos" };

const ESTADO = {
  activo: "Activo",
  borrador: "Borrador",
  archivado: "Archivado",
} as const;

export default async function ProductosAdmin() {
  const db = await getDb();
  const lista = await db
    .select({
      producto: productos,
      categoria: categorias.nombre,
      pares: sql<number>`coalesce(sum(greatest(${variantes.stock} - ${variantes.stockApartado}, 0)) filter (where ${variantes.activo}), 0)::int`,
      tallas: sql<number>`count(${variantes.id})::int`,
    })
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .leftJoin(variantes, eq(variantes.productoId, productos.id))
    .groupBy(productos.id, categorias.nombre, categorias.orden)
    .orderBy(asc(categorias.orden), asc(productos.nombre));

  return (
    <>
      <TituloAdmin
        accion={
          <Link href="/admin/productos/nuevo" className="btn-primario">
            + Nuevo producto
          </Link>
        }
      >
        Productos
      </TituloAdmin>

      {lista.length === 0 ? (
        <p>Todavía no hay productos. Crea el primero.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-[0.9375rem]">
            <thead>
              <tr className="border-b border-cafe/20 text-sm">
                <th className="py-3 pr-4 font-semibold">Producto</th>
                <th className="py-3 pr-4 font-semibold">Categoría</th>
                <th className="py-3 pr-4 font-semibold">Precio</th>
                <th className="py-3 pr-4 font-semibold">Pares disponibles</th>
                <th className="py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {lista.map(({ producto: p, categoria, pares, tallas }) => (
                <tr key={p.id} className="border-b border-cafe/10 hover:bg-crema-claro">
                  <td className="py-3 pr-4">
                    <Link href={`/admin/productos/${p.id}`} className="font-semibold hover:underline">
                      {p.nombre}
                    </Link>
                    {p.destacado && <span className="ml-2 text-xs text-cafe/85">★ Destacado</span>}
                  </td>
                  <td className="py-3 pr-4">{categoria}</td>
                  <td className="py-3 pr-4">{formatPrecio(p.precio)}</td>
                  <td className="py-3 pr-4">
                    {tallas === 0 ? (
                      <span className="text-terracota-oscuro">Sin tallas</span>
                    ) : pares === 0 ? (
                      <span className="font-semibold text-terracota-oscuro">Agotado</span>
                    ) : (
                      pares
                    )}
                  </td>
                  <td className="py-3">{ESTADO[p.estado]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
