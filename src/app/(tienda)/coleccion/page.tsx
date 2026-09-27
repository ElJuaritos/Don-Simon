import type { Metadata } from "next";
import { getCategorias } from "@/lib/data/catalogo";
import { VistaColeccion, type FiltrosColeccion } from "@/components/product/vista-coleccion";

export const metadata: Metadata = {
  title: "Colección",
  description: "Mocasines, botas y zapatos de piel hechos a mano en México.",
};

export default async function Coleccion({ searchParams }: PageProps<"/coleccion">) {
  const filtros = (await searchParams) as FiltrosColeccion;
  const categorias = await getCategorias();
  return (
    <VistaColeccion
      titulo="Colección"
      descripcion="Todos nuestros modelos, hechos a mano en piel."
      categorias={categorias}
      filtros={filtros}
      rutaBase="/coleccion"
    />
  );
}
