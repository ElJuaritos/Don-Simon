import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marca } from "@/config/marca";
import { disponibles, getProducto, getProductos } from "@/lib/data/catalogo";
import { listarPublicadasProducto, resumenProducto, seMuestranResenas } from "@/lib/data/resenas";
import { formatPromedio } from "@/lib/resenas-texto";
import { urlDelSitio } from "@/lib/sitio";
import { CombinarloCon } from "@/components/product/combinarlo-con";
import { GaleriaProducto } from "@/components/product/galeria-producto";
import { GuiaTallasPanel } from "@/components/product/guia-tallas-modal";
import { PestanasProducto, type PestanaProducto } from "@/components/product/pestanas-producto";
import { Precio } from "@/components/product/precio";
import { SelectorCompra } from "@/components/product/selector-compra";
import { RejillaProductos } from "@/components/product/tarjeta-producto";
import { Estrellas } from "@/components/resenas/estrellas";
import { SeccionResenas } from "@/components/resenas/seccion-resenas";
import { FotoProducto } from "@/components/ui/foto";

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const producto = await getProducto((await params).slug);
  if (!producto) return {};
  return {
    title: producto.nombre,
    description: producto.descripcion.slice(0, 160),
    openGraph: { images: producto.imagenes[0] ? [producto.imagenes[0].url] : undefined },
  };
}

function textoDetalles(producto: {
  materiales: string;
  construccion: string;
  suela: string;
  hechoEn: string;
}) {
  return [
    producto.materiales,
    producto.construccion && `Construcción: ${producto.construccion}`,
    producto.suela && `Suela: ${producto.suela}`,
    producto.hechoEn,
  ]
    .filter(Boolean)
    .join(". ")
    .replace(/\.\./g, ".");
}

export default async function PaginaProducto({ params, searchParams }: PageProps<"/producto/[slug]">) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const producto = await getProducto(slug);
  if (!producto) notFound();

  const colores = [...new Map(producto.variantes.map((v) => [v.color, v.colorHex]))].map(([nombre, hex]) => ({
    nombre,
    hex,
    imagen: producto.imagenes.find((i) => i.color === nombre) ?? null,
  }));
  const colorPedido = typeof sp.color === "string" ? sp.color : undefined;
  const color = colores.find((c) => c.nombre === colorPedido) ?? colores[0];
  const tallas = producto.variantes
    .filter((v) => v.color === color?.nombre)
    .map((v) => ({ varianteId: v.id, talla: v.talla, disponibles: disponibles(v) }));
  const imagenesColor = producto.imagenes
    .filter((i) => !i.color || i.color === color?.nombre)
    .map((i) => ({ url: i.url, alt: i.alt }));
  const hayStock = producto.variantes.some((v) => disponibles(v) > 0);

  const para = producto.publico === "unisex" ? undefined : producto.publico;
  const vistos = new Set<string>();
  const candidatos = (await getProductos({ para })).filter((p) => {
    if (p.id === producto.id || vistos.has(p.id)) return false;
    vistos.add(p.id);
    return true;
  });
  const relacionados = [
    ...candidatos.filter((p) => p.categoria.slug === producto.categoria.slug),
    ...candidatos.filter((p) => p.categoria.slug !== producto.categoria.slug),
  ].slice(0, 4);

  const pestanas = (
    [
      { id: "descripcion", titulo: "Descripción", texto: producto.descripcion },
      { id: "detalles", titulo: "Detalles", texto: textoDetalles(producto) },
      producto.horma && {
        id: "ajuste",
        titulo: "Ajuste",
        texto: `${producto.horma.nombre}. ${producto.horma.recomendacion}`,
        enlace: { href: "/nuestras-hormas", texto: "Nuestras hormas" },
      },
      { id: "cuidado", titulo: "Cuidado", texto: producto.cuidado },
    ] as (PestanaProducto | false | null | undefined)[]
  ).filter((p): p is PestanaProducto => Boolean(p && p.texto.trim()));

  const mostrarResenas = await seMuestranResenas();
  const resumen = mostrarResenas ? await resumenProducto(producto.id) : null;
  const resenas = resumen && resumen.total > 0 ? await listarPublicadasProducto(producto.id) : [];
  const conResenas = Boolean(resumen && resumen.total > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion,
    brand: { "@type": "Brand", name: marca.nombre },
    image: producto.imagenes.map((i) => `${urlDelSitio()}${i.url}`),
    offers: {
      "@type": "Offer",
      priceCurrency: "MXN",
      price: (producto.precio / 100).toFixed(2),
      availability: hayStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${urlDelSitio()}/producto/${producto.slug}`,
    },
    ...(conResenas && resumen
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: formatPromedio(resumen.promedio),
            reviewCount: resumen.total,
          },
          review: resenas.slice(0, 5).map((r) => ({
            "@type": "Review",
            author: { "@type": "Person", name: r.nombre },
            datePublished: r.fecha.slice(0, 10),
            name: r.titulo,
            reviewBody: r.texto,
            reviewRating: { "@type": "Rating", ratingValue: String(r.calificacion), bestRating: "5" },
          })),
        }
      : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="contenedor py-8 md:py-12">
        <nav aria-label="Migas de pan" className="text-sm text-cafe/85">
          <Link href="/" className="hover:text-cafe">
            Inicio
          </Link>
          {" / "}
          <Link href={`/coleccion/${producto.categoria.slug}`} className="hover:text-cafe">
            {producto.categoria.nombre}
          </Link>
          {" / "}
          <span aria-current="page">{producto.nombre}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:items-start lg:gap-14">
          <GaleriaProducto imagenes={imagenesColor} colorHex={color?.hex} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-sm text-cafe/70">{producto.categoria.nombre}</p>
            <div className="mt-2 flex items-baseline justify-between gap-4">
              <h1 className="font-sans text-2xl font-medium leading-tight md:text-[1.75rem]">{producto.nombre}</h1>
              <Precio precio={producto.precio} comparacion={producto.precioComparacion} className="shrink-0 text-lg" />
            </div>
            <p className="mt-1 text-right text-xs text-cafe/70">IVA incluido</p>
            {conResenas && resumen && (
              <a href="#resenas" className="mt-3 inline-flex items-center gap-2 text-sm">
                <Estrellas valor={resumen.promedio} />
                <span>
                  {resumen.total} {resumen.total === 1 ? "reseña" : "reseñas"}
                </span>
              </a>
            )}

            {color && (
              <div className="mt-8">
                <p className="text-sm">
                  Color <span className="font-medium">{color.nombre}</span>
                </p>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {colores.map((c) => {
                    const elegido = c.nombre === color.nombre;
                    return (
                      <li key={c.nombre}>
                        <Link
                          href={`?color=${encodeURIComponent(c.nombre)}`}
                          scroll={false}
                          replace
                          aria-label={c.nombre}
                          aria-current={elegido ? "true" : undefined}
                          className={`block w-16 border-b-2 pb-1 ${elegido ? "border-cafe" : "border-transparent hover:border-cafe/40"}`}
                        >
                          {c.imagen ? (
                            <FotoProducto imagen={c.imagen} sizes="64px" className="aspect-square w-16" />
                          ) : (
                            <span className="block aspect-square w-16 border border-cafe/15" style={{ backgroundColor: c.hex }} />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <GuiaTallasPanel publico={producto.publico} horma={producto.horma?.nombre} recomendacion={producto.horma?.recomendacion} />
            </div>
            <SelectorCompra key={color?.nombre} tallas={tallas} publico={producto.publico} />
            <PestanasProducto pestanas={pestanas} />
          </div>
        </div>
      </div>

      <CombinarloCon productos={[]} />

      {conResenas && resumen && <SeccionResenas resumen={resumen} resenas={resenas} />}

      {relacionados.length > 0 && (
        <section className="border-t border-cafe/10 bg-arena/50 py-16 md:py-24" aria-labelledby="titulo-relacionados">
          <div className="contenedor">
            <h2 id="titulo-relacionados" className="titulo-display mb-10 text-4xl">
              También te puede gustar
            </h2>
            <RejillaProductos productos={relacionados} />
          </div>
        </section>
      )}
    </>
  );
}
