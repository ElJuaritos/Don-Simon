import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { paginasLegales } from "@/content/ayuda";
import { PaginaTexto } from "@/components/layout/pagina-texto";

export function generateStaticParams() {
  return Object.keys(paginasLegales).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/legal/[slug]">): Promise<Metadata> {
  const pagina = paginasLegales[(await params).slug];
  return pagina ? { title: pagina.titulo, description: pagina.descripcion } : {};
}

export default async function PaginaLegal({ params }: PageProps<"/legal/[slug]">) {
  const pagina = paginasLegales[(await params).slug];
  if (!pagina) notFound();
  return <PaginaTexto pagina={pagina} />;
}
