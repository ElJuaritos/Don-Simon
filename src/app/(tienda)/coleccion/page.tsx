import type { Metadata } from "next";
import { getCategorias } from "@/lib/data/catalogo";
import { VistaColeccion, type FiltrosColeccion } from "@/components/product/vista-coleccion";

const DESCRIPCION = "Mocasines, botas y zapatos de piel hechos a mano en México.";

export async function generateMetadata({ searchParams }: PageProps<"/coleccion">): Promise<Metadata> {
  const { para } = await searchParams;
  if (para === "hombre") return { title: "Hombre", description: `Calzado de piel para hombre. ${DESCRIPCION}` };
  if (para === "mujer") return { title: "Mujer", description: `Calzado de piel para mujer. ${DESCRIPCION}` };
  return { title: "Colección", description: DESCRIPCION };
}

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
