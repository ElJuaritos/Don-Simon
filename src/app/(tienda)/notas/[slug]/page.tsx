import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marca } from "@/config/marca";
import { getNotaPublicada, notasVecinas } from "@/lib/data/notas";
import { formatDia } from "@/lib/formato";
import { urlDelSitio } from "@/lib/sitio";
import { CuerpoNota } from "@/components/tienda/cuerpo-nota";
import { Foto } from "@/components/ui/foto";

export async function generateMetadata({ params }: PageProps<"/notas/[slug]">): Promise<Metadata> {
  const nota = await getNotaPublicada((await params).slug);
  if (!nota) return { title: "Nota" };
  return {
    title: nota.titulo,
    description: nota.resumen,
    openGraph: {
      title: nota.titulo,
      description: nota.resumen,
      type: "article",
      images: nota.imagenUrl ? [{ url: nota.imagenUrl, alt: nota.imagenAlt || nota.titulo }] : undefined,
    },
  };
}

export default async function Nota({ params }: PageProps<"/notas/[slug]">) {
  const { slug } = await params;
  const nota = await getNotaPublicada(slug);
  if (!nota) notFound();

  const { anterior, siguiente } = await notasVecinas(slug);
  const fecha = nota.publicadaEn ?? nota.createdAt;
  const imagen = nota.imagenUrl
    ? nota.imagenUrl.startsWith("http")
      ? nota.imagenUrl
      : `${urlDelSitio()}${nota.imagenUrl}`
    : null;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: nota.titulo,
    description: nota.resumen,
    datePublished: fecha.toISOString(),
    dateModified: nota.updatedAt.toISOString(),
    author: { "@type": "Organization", name: marca.nombre },
    publisher: { "@type": "Organization", name: marca.nombre },
    mainEntityOfPage: `${urlDelSitio()}/notas/${nota.slug}`,
    ...(imagen ? { image: [imagen] } : {}),
  };

  return (
    <article className="pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className="contenedor max-w-3xl pt-12 md:pt-20">
        <p className="etiqueta text-cafe/85">
          <Link href="/notas" className="hover:opacity-60">
            Notas
          </Link>
        </p>
        <h1 className="titulo-display mt-4 text-5xl md:text-6xl">{nota.titulo}</h1>
        <p className="mt-4 text-cafe/80">
          <time dateTime={fecha.toISOString()}>{formatDia(fecha)}</time>
        </p>
      </header>

      <div className="contenedor mt-10">
        <Foto
          imagen={nota.imagenUrl ? { url: nota.imagenUrl, alt: nota.imagenAlt || nota.titulo } : null}
          tono="piedra"
          sinIlustracion
          prioridad
          sizes="100vw"
          className="aspect-[4/5] sm:aspect-[16/9]"
        />
      </div>

      <div className="contenedor mt-12 max-w-2xl text-lg">
        <CuerpoNota texto={nota.cuerpo} />
      </div>

      {(anterior || siguiente) && (
        <nav aria-label="Otras notas" className="contenedor mt-16 grid max-w-3xl gap-6 border-t border-cafe/10 pt-8 sm:grid-cols-2">
          {anterior ? (
            <Link href={`/notas/${anterior.slug}`} className="hover:opacity-60">
              <span className="etiqueta text-cafe/75">Anterior</span>
              <span className="mt-2 block text-lg">{anterior.titulo}</span>
            </Link>
          ) : (
            <span />
          )}
          {siguiente && (
            <Link href={`/notas/${siguiente.slug}`} className="hover:opacity-60 sm:text-right">
              <span className="etiqueta text-cafe/75">Siguiente</span>
              <span className="mt-2 block text-lg">{siguiente.titulo}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
