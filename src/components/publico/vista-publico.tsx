import { fotoDeCategoria, getCategoriasPara, getProductos } from "@/lib/data/catalogo";
import { getBloques } from "@/lib/data/contenido";
import { CarruselProductos } from "@/components/product/carrusel-productos";
import { TarjetaProducto } from "@/components/product/tarjeta-producto";
import { HeroesPublico } from "./heroes-publico";
import { TopCategorias } from "./top-categorias";

/** Página de aterrizaje de Hombre o Mujer. La comparten las dos rutas. */
export async function VistaPublico({ para }: { para: "hombre" | "mujer" }) {
  const [bloques, destacados, categorias] = await Promise.all([
    getBloques("publico"),
    getProductos({ para, tipo: "calzado", soloDestacados: true }),
    getCategoriasPara(para),
  ]);
  const primero = bloques[`${para}-hero-1`];
  const titulo = primero?.titulo || (para === "hombre" ? "Hombre" : "Mujer");

  return (
    <>
      <h1 className="sr-only">{titulo}</h1>
      <HeroesPublico bloques={[primero, bloques[`${para}-hero-2`]]} />
      {destacados.length > 0 && (
        <section className="seccion" aria-labelledby={`destacados-${para}`}>
          <h2 id={`destacados-${para}`} className="text-center text-xl font-medium md:text-2xl">
            Destacados de la temporada
          </h2>
          <div className="mt-8">
            <CarruselProductos etiqueta="Destacados de la temporada">
              {destacados.map((p) => (
                <TarjetaProducto key={`${p.id}-${p.color}`} producto={p} />
              ))}
            </CarruselProductos>
          </div>
        </section>
      )}
      <TopCategorias
        para={para}
        categorias={categorias.slice(0, 3).map((c) => ({
          slug: c.slug,
          nombre: c.nombre,
          imagen: fotoDeCategoria(c, para),
        }))}
      />
    </>
  );
}
