import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoria, getCategorias } from "@/lib/data/catalogo";
import { VistaColeccion, type FiltrosColeccion } from "@/components/product/vista-coleccion";

export async function generateMetadata({ params }: PageProps<"/coleccion/[categoria]">): Promise<Metadata> {
  const categoria = await getCategoria((await params).categoria);
  return categoria ? { title: categoria.nombre, description: categoria.descripcion } : {};
}

export default async function ColeccionCategoria({ params, searchParams }: PageProps<"/coleccion/[categoria]">) {
  const [{ categoria: slug }, filtros] = await Promise.all([params, searchParams]);
  const [categoria, categorias] = await Promise.all([getCategoria(slug), getCategorias()]);
  if (!categoria) notFound();

  return (
    <VistaColeccion
      titulo={categoria.nombre}
      descripcion={categoria.descripcion}
      categoria={categoria}
      categorias={categorias}
      filtros={filtros as FiltrosColeccion}
      rutaBase={`/coleccion/${categoria.slug}`}
    />
  );
}
