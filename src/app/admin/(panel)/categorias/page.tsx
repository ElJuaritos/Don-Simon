import type { Metadata } from "next";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { productos } from "@/db/schema";
import { crearCategoria } from "@/lib/actions/admin";
import { getCategorias } from "@/lib/data/catalogo";
import { FormAdmin } from "@/components/admin/form-admin";
import { Tarjeta, TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Categorías" };

export default async function CategoriasAdmin() {
  const db = await getDb();
  const [cats, conteos] = await Promise.all([
    getCategorias(),
    db.select({ id: productos.categoriaId, n: count() }).from(productos).where(eq(productos.estado, "activo")).groupBy(productos.categoriaId),
  ]);

  return (
    <>
      <TituloAdmin>Categorías</TituloAdmin>
      <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
        <Tarjeta titulo="Actuales">
          <ul className="divide-y divide-cafe/10">
            {cats.map((c) => (
              <li key={c.id} className="py-3">
                <p className="font-semibold">
                  {c.nombre}{" "}
                  <span className="text-sm font-normal text-cafe/85">
                    · {conteos.find((x) => x.id === c.id)?.n ?? 0} productos activos
                  </span>
                </p>
                <p className="text-sm text-cafe/85">/coleccion/{c.slug}</p>
              </li>
            ))}
          </ul>
        </Tarjeta>
        <Tarjeta titulo="Nueva categoría">
          <FormAdmin action={crearCategoria} boton="Crear categoría" className="space-y-4">
            <label className="block">
              <span className="campo-label">Nombre</span>
              <input name="nombre" required className="campo" placeholder="Sandalias" />
            </label>
            <label className="block">
              <span className="campo-label">Descripción corta</span>
              <textarea name="descripcion" rows={2} className="campo" />
            </label>
          </FormAdmin>
        </Tarjeta>
      </div>
    </>
  );
}
