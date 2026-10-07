import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { paginasAyuda } from "@/content/ayuda";
import { PaginaTexto } from "@/components/layout/pagina-texto";
import { FormDevolucion } from "../form-devolucion";

export function generateStaticParams() {
  return Object.keys(paginasAyuda).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/ayuda/[slug]">): Promise<Metadata> {
  const pagina = paginasAyuda[(await params).slug];
  return pagina ? { title: pagina.titulo, description: pagina.descripcion } : {};
}

export default async function PaginaAyuda({ params }: PageProps<"/ayuda/[slug]">) {
  const { slug } = await params;
  const pagina = paginasAyuda[slug];
  if (!pagina) notFound();
  return (
    <>
      <PaginaTexto pagina={pagina} seccion={{ href: "/ayuda", texto: "Ayuda" }} />
      {slug === "cambios-y-devoluciones" && (
        <section className="contenedor max-w-3xl pb-16" aria-labelledby="titulo-devolucion">
          <h2 id="titulo-devolucion" className="titulo-display text-4xl">
            Registrar un cambio o devolución
          </h2>
          <div className="mt-8">
            <FormDevolucion />
          </div>
        </section>
      )}
    </>
  );
}
