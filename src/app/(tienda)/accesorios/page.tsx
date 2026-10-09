import type { Metadata } from "next";
import { marca } from "@/config/marca";
import { getCategorias } from "@/lib/data/catalogo";
import { VistaColeccion } from "@/components/product/vista-coleccion";

const DESCRIPCION = `Cinturones, calcetines, hormas y cuidado del calzado de ${marca.nombre}.`;

export async function generateMetadata({ searchParams }: PageProps<"/accesorios">): Promise<Metadata> {
  const { para } = await searchParams;
  if (para === "hombre") return { title: "Accesorios para hombre", description: DESCRIPCION };
  if (para === "mujer") return { title: "Accesorios para mujer", description: DESCRIPCION };
  return { title: "Accesorios", description: DESCRIPCION };
}

export default async function Accesorios({ searchParams }: PageProps<"/accesorios">) {
  const filtros = await searchParams;
  const categorias = (await getCategorias()).filter((c) => c.tipo === "accesorio");
  const para = filtros.para === "mujer" ? "mujer" : filtros.para === "hombre" ? "hombre" : undefined;
  return (
    <VistaColeccion
      titulo={para === "mujer" ? "Accesorios para mujer" : para === "hombre" ? "Accesorios para hombre" : "Accesorios"}
      descripcion="Para acompañar el par: cinturones, calcetines, hormas y kits de cuidado."
      categorias={categorias}
      searchParams={filtros}
      tipo="accesorio"
      rutaBase="/accesorios"
    />
  );
}
