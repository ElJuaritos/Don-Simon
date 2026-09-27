import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/db";
import { hormas } from "@/db/schema";
import { getCategorias } from "@/lib/data/catalogo";
import { FormProducto } from "@/components/admin/form-producto";
import { Tarjeta, TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Nuevo producto" };

export default async function NuevoProducto() {
  const db = await getDb();
  const [cats, listaHormas] = await Promise.all([getCategorias(), db.select().from(hormas)]);
  return (
    <>
      <Link href="/admin/productos" className="enlace text-sm">
        ← Productos
      </Link>
      <div className="mt-3">
        <TituloAdmin>Nuevo producto</TituloAdmin>
      </div>
      <Tarjeta className="max-w-4xl">
        <p className="mb-6 bg-crema-claro px-4 py-3 text-sm">
          Primero guarda los datos generales. Después podrás agregar colores, tallas, inventario y fotos.
        </p>
        <FormProducto categorias={cats} hormas={listaHormas} />
      </Tarjeta>
    </>
  );
}
