import { getCategorias, getProductos } from "@/lib/data/catalogo";
import { getBloques } from "@/lib/data/contenido";
import { RejillaProductos } from "@/components/product/tarjeta-producto";
import { CuadroEnlace } from "@/components/portada/cuadro-enlace";
import { EditorialDividido } from "@/components/portada/editorial-dividido";
import { EncabezadoSeccion } from "@/components/portada/encabezado-seccion";
import { Galeria } from "@/components/portada/galeria";
import { Hero } from "@/components/portada/hero";
import { Manifiesto } from "@/components/portada/manifiesto";
import { Valores } from "@/components/portada/valores";

// Portada editorial. Las fotos y los textos de cada cuadro se editan en /admin/contenido.

export default async function Inicio() {
  const [b, categorias, destacados] = await Promise.all([
    getBloques("portada"),
    getCategorias(),
    getProductos({ soloDestacados: true, limite: 4 }),
  ]);
  const publico = [b["portada-hombre"], b["portada-mujer"]];

  return (
    <>
      <Hero bloque={b["portada-hero"]} />

      {/* Hombre / Mujer: dos cuadros grandes lado a lado */}
      <section className="grid gap-2 px-2 pt-2 md:grid-cols-2" aria-label="Comprar por público">
        {publico.map((bloque) => (
          <CuadroEnlace
            key={bloque.clave}
            href={bloque.enlaceUrl || "/coleccion"}
            imagen={bloque.imagen}
            titulo={bloque.titulo}
            etiqueta={bloque.enlaceTexto}
            nota={bloque.notaFoto}
            tono="claro"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] lg:aspect-[5/6]"
          />
        ))}
      </section>

      <Manifiesto bloque={b["portada-manifiesto"]} />

      {/* Categorías: en celular se deslizan de lado */}
      <section className="contenedor pb-20 md:pb-28" aria-labelledby="titulo-categorias">
        <EncabezadoSeccion
          id="titulo-categorias"
          etiqueta="Colección"
          titulo="Encuentra tu par"
          enlace={{ href: "/coleccion", texto: "Ver todo" }}
        />
        <ul className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0">
          {categorias.map((c) => (
            <li key={c.id} className="w-[78%] shrink-0 snap-start sm:w-auto">
              <CuadroEnlace
                href={`/coleccion/${c.slug}`}
                imagen={c.imagenUrl ? { url: c.imagenUrl, alt: c.nombre } : null}
                titulo={c.nombre}
                nota={`${c.nombre.toLowerCase()} de la colección`}
                tono="piedra"
                sizes="(min-width: 640px) 33vw, 78vw"
                className="aspect-[3/4]"
              />
            </li>
          ))}
        </ul>
      </section>

      {destacados.length > 0 && (
        <section className="border-t border-cafe/10 bg-arena/50" aria-labelledby="titulo-destacados">
          <div className="contenedor seccion">
            <EncabezadoSeccion
              id="titulo-destacados"
              etiqueta="Selección de la casa"
              titulo="Los favoritos"
              enlace={{ href: "/coleccion?orden=novedades", texto: "Ver novedades" }}
            />
            <RejillaProductos productos={destacados} />
          </div>
        </section>
      )}

      <div className="py-8 md:py-16">
        <EditorialDividido bloque={b["portada-oficio"]} etiqueta="El oficio" />
        <EditorialDividido bloque={b["portada-hormas"]} etiqueta="Ajuste" invertido />
        <Galeria fotos={[b["portada-galeria-1"], b["portada-galeria-2"], b["portada-galeria-3"]]} />
      </div>

      <Valores />
    </>
  );
}
