import Link from "next/link";
import type { Categoria } from "@/db/schema";
import { getOpcionesFiltro, getProductos, type Orden } from "@/lib/data/catalogo";
import { FormFiltros, ORDENES } from "./filtros-coleccion";
import { RejillaProductos } from "./tarjeta-producto";

// Listado de productos compartido por /coleccion y /coleccion/[categoria].
// ?para=hombre|mujer filtra por público (los unisex aparecen en ambos).

export type FiltrosColeccion = { talla?: string; color?: string; orden?: string; para?: string };

const PUBLICOS = [
  { valor: undefined, texto: "Todo" },
  { valor: "hombre", texto: "Hombre" },
  { valor: "mujer", texto: "Mujer" },
] as const;

type Para = "hombre" | "mujer";

/** Arma la URL conservando el público elegido. */
function conPara(ruta: string, para?: Para) {
  return para ? `${ruta}?para=${para}` : ruta;
}

export async function VistaColeccion({
  titulo,
  descripcion,
  categoria,
  categorias,
  filtros,
  rutaBase,
}: {
  titulo: string;
  descripcion?: string;
  categoria?: Categoria;
  categorias: Categoria[];
  filtros: FiltrosColeccion;
  rutaBase: string;
}) {
  const para: Para | undefined = filtros.para === "hombre" || filtros.para === "mujer" ? filtros.para : undefined;
  const talla = filtros.talla ? Number(filtros.talla) : undefined;
  const orden = ORDENES.some((o) => o.valor === filtros.orden) ? (filtros.orden as Orden) : "destacados";
  const [productos, opciones] = await Promise.all([
    getProductos({
      categoriaSlug: categoria?.slug,
      para,
      talla: Number.isFinite(talla) ? talla : undefined,
      color: filtros.color || undefined,
      orden,
    }),
    getOpcionesFiltro(),
  ]);

  const nombrePara = PUBLICOS.find((p) => p.valor === para)?.texto;
  const tituloFinal = para && !categoria ? nombrePara! : titulo;
  const pestana = (activa: boolean) =>
    `whitespace-nowrap border-b pb-1.5 transition-colors ${activa ? "border-cafe" : "border-transparent text-cafe/85 hover:text-cafe"}`;

  return (
    <div className="contenedor py-12 md:py-20">
      <header className="max-w-2xl">
        <nav aria-label="Migas de pan" className="text-sm text-cafe/85">
          <Link href="/" className="hover:text-cafe">
            Inicio
          </Link>
          {(categoria || para) && (
            <>
              {" / "}
              <Link href="/coleccion" className="hover:text-cafe">
                Colección
              </Link>
            </>
          )}
          {categoria && para && (
            <>
              {" / "}
              <Link href={conPara("/coleccion", para)} className="hover:text-cafe">
                {nombrePara}
              </Link>
            </>
          )}
        </nav>
        <h1 className="titulo-display mt-4 text-5xl md:text-7xl">{tituloFinal}</h1>
        {descripcion && <p className="mt-5 text-lg">{descripcion}</p>}
      </header>

      <div className="mt-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <nav aria-label="Público" className="etiqueta flex gap-6">
          {PUBLICOS.map((p) => (
            <Link key={p.texto} href={conPara(rutaBase, p.valor)} aria-current={p.valor === para ? "page" : undefined} className={pestana(p.valor === para)}>
              {p.texto}
            </Link>
          ))}
        </nav>
        <nav aria-label="Categorías" className="-mx-4 flex gap-6 overflow-x-auto px-4 text-[0.9375rem] md:mx-0 md:px-0">
          <Link href={conPara("/coleccion", para)} className={pestana(!categoria)}>
            Todas
          </Link>
          {categorias.map((c) => (
            <Link key={c.id} href={conPara(`/coleccion/${c.slug}`, para)} className={pestana(categoria?.id === c.id)}>
              {c.nombre}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        <FormFiltros
          rutaBase={rutaBase}
          para={para}
          talla={filtros.talla}
          color={filtros.color}
          orden={orden}
          opciones={opciones}
          total={productos.length}
          limpiarHref={conPara(rutaBase, para)}
        />
      </div>

      <div className="mt-12">
        {productos.length > 0 ? (
          <RejillaProductos productos={productos} />
        ) : (
          <div className="py-24 text-center">
            <p className="titulo-display text-3xl md:text-4xl">No encontramos modelos con esos filtros.</p>
            <Link href={conPara(rutaBase, para)} className="btn-contorno mt-8">
              Ver todo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
