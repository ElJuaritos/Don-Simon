import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marca, tienda } from "@/config/marca";
import { disponibles, getProducto, getProductos } from "@/lib/data/catalogo";
import { formatPrecio } from "@/lib/formato";
import { urlDelSitio } from "@/lib/sitio";
import { GuiaTallasModal } from "@/components/product/guia-tallas-modal";
import { Precio } from "@/components/product/precio";
import { SelectorCompra } from "@/components/product/selector-compra";
import { RejillaProductos } from "@/components/product/tarjeta-producto";
import { FotoPendiente, FotoProducto } from "@/components/ui/foto";
import { IconoAguja, IconoCamion } from "@/components/ui/iconos";

export async function generateMetadata({ params }: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const producto = await getProducto((await params).slug);
  if (!producto) return {};
  return {
    title: producto.nombre,
    description: producto.descripcion.slice(0, 160),
    openGraph: { images: producto.imagenes[0] ? [producto.imagenes[0].url] : undefined },
  };
}

const ANGULOS = ["lateral", "vista 3/4", "detalle de costura", "suela"];

export default async function PaginaProducto({ params, searchParams }: PageProps<"/producto/[slug]">) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const producto = await getProducto(slug);
  if (!producto) notFound();

  const colores = [...new Map(producto.variantes.map((v) => [v.color, v.colorHex]))].map(([nombre, hex]) => ({
    nombre,
    hex,
  }));
  const colorPedido = typeof sp.color === "string" ? sp.color : undefined;
  const color = colores.find((c) => c.nombre === colorPedido) ?? colores[0];
  const tallas = producto.variantes
    .filter((v) => v.color === color?.nombre)
    .map((v) => ({ varianteId: v.id, talla: v.talla, disponibles: disponibles(v) }));
  const imagenesColor = producto.imagenes.filter((i) => !i.color || i.color === color?.nombre);
  const hayStock = producto.variantes.some((v) => disponibles(v) > 0);

  const relacionados = (await getProductos({ categoriaSlug: producto.categoria.slug }))
    .filter((p) => p.id !== producto.id)
    .slice(0, 4);

  type Detalle = { titulo: string; contenido: string; abierto?: boolean; enlace?: { href: string; texto: string } };
  const detalles = ([
    { titulo: "Descripción", contenido: producto.descripcion, abierto: true },
    {
      titulo: "Materiales y construcción",
      contenido: [producto.materiales, producto.construccion && `Construcción: ${producto.construccion}.`, producto.suela && `${producto.suela}.`, producto.hechoEn && `${producto.hechoEn}.`]
        .filter(Boolean)
        .join(" "),
    },
    producto.horma && {
      titulo: "Horma y ajuste",
      contenido: `${producto.horma.nombre}. ${producto.horma.recomendacion}`,
    },
    { titulo: "Cuidado", contenido: producto.cuidado },
    {
      titulo: "Envíos y cambios",
      contenido: `Enviamos a todo México. Envío gratis en compras desde ${formatPrecio(tienda.envioGratisDesde)}. Consulta nuestra política de cambios y devoluciones.`,
      enlace: { href: "/ayuda/cambios-y-devoluciones", texto: "Cambios y devoluciones" },
    },
  ] as (Detalle | null)[]).filter((d): d is Detalle => Boolean(d?.contenido));

  // Datos estructurados para Google (docs/04-funcionalidades.md, SEO)
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
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="contenedor py-8 md:py-12">
        <nav aria-label="Migas de pan" className="text-sm text-cafe/85">
          <Link href="/" className="hover:text-cafe">Inicio</Link>
          {" / "}
          <Link href={`/coleccion/${producto.categoria.slug}`} className="hover:text-cafe">
            {producto.categoria.nombre}
          </Link>
          {" / "}
          <span aria-current="page">{producto.nombre}</span>
        </nav>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {/* Galería: en móvil se desliza horizontalmente */}
          <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
            {imagenesColor.length > 0
              ? imagenesColor.map((img, i) => (
                  <FotoProducto
                    key={img.id}
                    imagen={img}
                    prioridad={i === 0}
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 85vw"
                    className={`aspect-[4/5] w-[85%] shrink-0 snap-center sm:w-auto ${i === 0 ? "sm:col-span-2" : ""}`}
                  />
                ))
              : ANGULOS.map((angulo, i) => (
                  <FotoPendiente
                    key={angulo}
                    tono="claro"
                    colorZapato={i === 0 ? color?.hex : undefined}
                    nota={angulo}
                    className={`aspect-[4/5] w-[85%] shrink-0 snap-center sm:w-auto ${i === 0 ? "sm:col-span-2 sm:aspect-[4/3]" : ""}`}
                  />
                ))}
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="etiqueta text-cafe/85">{producto.categoria.nombre}</p>
            <h1 className="titulo-display mt-2 text-5xl md:text-6xl">{producto.nombre}</h1>
            <Precio precio={producto.precio} comparacion={producto.precioComparacion} className="mt-4 text-xl" />
            <p className="mt-1 text-sm text-cafe/85">IVA incluido</p>

            {colores.length > 1 && (
              <div className="mt-8">
                <p className="etiqueta">
                  Color <span className="ml-2 normal-case tracking-normal">· {color?.nombre}</span>
                </p>
                <div className="mt-3 flex gap-3">
                  {colores.map((c) => (
                    <Link
                      key={c.nombre}
                      href={`?color=${encodeURIComponent(c.nombre)}`}
                      scroll={false}
                      replace
                      aria-label={c.nombre}
                      aria-current={c.nombre === color?.nombre}
                      className={`h-10 w-10 rounded-full border-2 p-0.5 transition-colors ${c.nombre === color?.nombre ? "border-cafe" : "border-transparent hover:border-cafe/40"}`}
                    >
                      <span className="block h-full w-full rounded-full border border-cafe/15" style={{ backgroundColor: c.hex }} />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              <div className="mb-1 flex justify-end">
                <GuiaTallasModal recomendacion={producto.horma?.recomendacion} />
              </div>
              <SelectorCompra key={color?.nombre} tallas={tallas} />
            </div>

            <ul className="mt-6 space-y-2 border-y border-cafe/10 py-5 text-sm">
              <li className="flex items-center gap-3">
                <IconoCamion width={20} /> Envío gratis en compras desde {formatPrecio(tienda.envioGratisDesde)}
              </li>
              <li className="flex items-center gap-3">
                <IconoAguja width={20} /> Hecho a mano en México
              </li>
            </ul>

            <div className="mt-2 divide-y divide-cafe/10">
              {detalles.map((d) => (
                <details key={d.titulo} open={d.abierto} className="group py-4">
                  <summary className="etiqueta flex cursor-pointer list-none items-center justify-between">
                    {d.titulo}
                    <span className="text-lg transition-transform group-open:rotate-45" aria-hidden>+</span>
                  </summary>
                  <p className="mt-3">{d.contenido}</p>
                  {d.enlace && (
                    <Link href={d.enlace.href} className="enlace mt-2 inline-block text-sm">
                      {d.enlace.texto}
                    </Link>
                  )}
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="border-t border-cafe/10 bg-crema/40 py-16 md:py-20" aria-labelledby="titulo-relacionados">
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
