import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { paginasAyuda } from "@/content/ayuda";
import { PaginaTexto } from "@/components/layout/pagina-texto";

export function generateStaticParams() {
  return Object.keys(paginasAyuda).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/ayuda/[slug]">): Promise<Metadata> {
  const pagina = paginasAyuda[(await params).slug];
  return pagina ? { title: pagina.titulo, description: pagina.descripcion } : {};
}

export default async function PaginaAyuda({ params }: PageProps<"/ayuda/[slug]">) {
  const pagina = paginasAyuda[(await params).slug];
  if (!pagina) notFound();
  return <PaginaTexto pagina={pagina} seccion={{ href: "/ayuda", texto: "Ayuda" }} />;
}
