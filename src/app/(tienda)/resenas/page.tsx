import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marca } from "@/config/marca";
import { listarPublicadasGlobal, resumenGlobal, seMuestranResenas } from "@/lib/data/resenas";
import { ListaResenas } from "@/components/resenas/lista-resenas";
import { ResumenResenasVista } from "@/components/resenas/resumen-resenas";

export async function generateMetadata(): Promise<Metadata> {
  if (!(await seMuestranResenas())) return { title: "Reseñas" };
  return {
    title: "Reseñas",
    description: `Lo que cuentan quienes ya caminan con ${marca.nombre}.`,
  };
}

export default async function PaginaResenas() {
  if (!(await seMuestranResenas())) notFound();
  const [resumen, resenas] = await Promise.all([resumenGlobal(), listarPublicadasGlobal()]);

  return (
    <div className="contenedor py-10 md:py-16">
      <h1 className="titulo-display text-4xl md:text-5xl">Reseñas</h1>
      <p className="mt-3 max-w-xl text-negro/80">Lo que cuentan quienes ya caminan con {marca.nombre}.</p>
      <div className="mt-8">
        <ResumenResenasVista resumen={resumen} />
      </div>
      <div className="mt-10">
        <ListaResenas resenas={resenas} mostrarProducto />
      </div>
    </div>
  );
}
