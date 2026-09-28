import type { Metadata } from "next";
import { count, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { productos } from "@/db/schema";
import { crearCategoria } from "@/lib/actions/admin";
import { guardarCategoria } from "@/lib/actions/contenido";
import { getCategorias } from "@/lib/data/catalogo";
import { Campo, CampoFoto } from "@/components/admin/campos";
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
      <p className="mb-8 max-w-2xl text-cafe/85">
        La foto de cada categoría aparece en los cuadros de la portada. Usa fotos verticales (3:4).
      </p>
      <div className="grid max-w-3xl gap-6">
        {cats.map((c) => (
          <Tarjeta key={c.id} titulo={c.nombre} className="bg-white">
            <p className="-mt-3 mb-5 text-sm text-cafe/85">
              /coleccion/{c.slug} · {conteos.find((x) => x.id === c.id)?.n ?? 0} productos activos
            </p>
            <FormAdmin action={guardarCategoria} boton="Guardar" className="space-y-5">
              <input type="hidden" name="id" value={c.id} />
              <div className="grid gap-5 sm:grid-cols-[1fr_7rem]">
                <Campo label="Nombre">
                  <input name="nombre" required defaultValue={c.nombre} className="campo" />
                </Campo>
                <Campo label="Orden">
                  <input name="orden" type="number" min={0} defaultValue={c.orden} className="campo" />
                </Campo>
              </div>
              <Campo label="Descripción corta" ayuda="Aparece arriba de los productos de la categoría.">
                <textarea name="descripcion" rows={2} defaultValue={c.descripcion} className="campo" />
              </Campo>
              <CampoFoto id={c.id} actual={c.imagenUrl} alt={c.nombre} proporcion="Vertical 3:4" />
            </FormAdmin>
          </Tarjeta>
        ))}

        <Tarjeta titulo="Nueva categoría" className="bg-white">
          <FormAdmin action={crearCategoria} boton="Crear categoría" className="space-y-4">
            <Campo label="Nombre">
              <input name="nombre" required className="campo" placeholder="Sandalias" />
            </Campo>
            <Campo label="Descripción corta">
              <textarea name="descripcion" rows={2} className="campo" />
            </Campo>
          </FormAdmin>
        </Tarjeta>
      </div>
    </>
  );
}
