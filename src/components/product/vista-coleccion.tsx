import Link from "next/link";
import type { Categoria, Ocasion, TipoCategoria } from "@/db/schema";
import { fotoDeCategoria, getCatalogo, type Orden } from "@/lib/data/catalogo";
import {
  ETIQUETA_OCASION,
  POR_PAGINA,
  etiquetaTalla,
  hrefColeccion,
  leerFiltros,
  quitarValor,
  type FiltrosUrl,
} from "@/lib/filtros-coleccion";
import { Foto } from "@/components/ui/foto";
import { FormFiltros, type OpcionFiltro } from "./filtros-coleccion";
import { ORDENES } from "./ordenes";
import { RejillaProductos } from "./tarjeta-producto";

// Listado compartido por /coleccion y /coleccion/[categoria].
// ?para=hombre|mujer incluye también los modelos unisex.

type Crudo = Record<string, string | string[] | undefined>;

export async function VistaColeccion({
  titulo,
  descripcion,
  categoria,
  categorias,
  searchParams,
  tipo = "calzado",
  rutaBase = "/coleccion",
}: {
  titulo: string;
  descripcion?: string;
  categoria?: Categoria;
  categorias: Categoria[];
  searchParams: Crudo;
  tipo?: TipoCategoria;
  rutaBase?: string;
}) {
  const filtros = leerFiltros(searchParams, categoria?.slug);
  const orden = ORDENES.some((o) => o.valor === filtros.orden) ? (filtros.orden as Orden) : "destacados";
  const { tarjetas, opciones } = await getCatalogo({
    tipo,
    para: filtros.para,
    estilo: filtros.estilos,
    talla: filtros.tallas,
    color: filtros.colores,
    material: filtros.materiales,
    ocasion: tipo === "accesorio" ? undefined : filtros.ocasiones,
    orden,
  });

  const visibles = tarjetas.slice(0, filtros.pagina * POR_PAGINA);
  const nombrePara = filtros.para === "hombre" ? "Hombre" : filtros.para === "mujer" ? "Mujer" : undefined;
  const tituloFinal = tipo === "calzado" && nombrePara && !categoria ? nombrePara : titulo;
  const foto = categoria ? fotoDeCategoria(categoria, filtros.para) : null;
  const vacios = { estilos: [], tallas: [], colores: [], materiales: [], ocasiones: [] as Ocasion[], orden: "destacados", pagina: 1, para: filtros.para };
  const limpiar = hrefColeccion(rutaBase, { ...filtros, ...vacios });
  const chips = chipsDe(filtros, categorias, rutaBase);
  const tallasVisibles = opciones.tallas.some((t) => t !== "Única") ? opciones.tallas : [];

  const grupos = [
    grupo("estilo", "Estilo", "estilo", opciones.estilos.map((e) => ({ valor: e.slug, texto: e.nombre })), filtros.estilos),
    grupo("talla", "Talla", "talla", tallasVisibles.map((t) => ({ valor: t, texto: etiquetaTalla(t) })), filtros.tallas),
    grupo("color", "Color", "color", opciones.colores.map((c) => ({ valor: c, texto: c })), filtros.colores),
    grupo("material", "Material", "material", opciones.materiales.map((m) => ({ valor: m, texto: m })), filtros.materiales),
    ...(tipo === "accesorio"
      ? []
      : [grupo("ocasion", "Ocasión", "ocasion", opciones.ocasiones.map((o) => ({ valor: o, texto: ETIQUETA_OCASION[o] })), filtros.ocasiones)]),
  ];

  return (
    <div className="pb-16 md:pb-24">
      <FormFiltros
        rutaBase={rutaBase}
        para={filtros.para}
        orden={orden}
        grupos={grupos}
        total={tarjetas.length}
        llave={JSON.stringify(filtros)}
      />

      <div className="contenedor pt-8 md:pt-12">
        {chips.length > 0 && (
          <ul className="mb-6 flex flex-wrap items-center gap-2" aria-label="Filtros activos">
            {chips.map((c) => (
              <li key={c.texto}>
                <Link href={c.href} scroll={false} className="texto-nav inline-flex min-h-11 items-center gap-2 border border-negro/20 px-3">
                  {c.texto}
                  <span aria-hidden>×</span>
                  <span className="sr-only">Quitar {c.texto}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link href={limpiar} scroll={false} className="enlace-nav min-h-11 py-3">
                Limpiar todo
              </Link>
            </li>
          </ul>
        )}

        <header className="max-w-2xl">
          <nav aria-label="Migas de pan" className="text-sm text-negro/85">
            <Link href="/" className="hover:text-negro">
              Inicio
            </Link>
            {(categoria || filtros.para) && (
              <>
                {" / "}
                <Link href={filtros.para ? `${rutaBase}?para=${filtros.para}` : rutaBase} className="hover:text-negro">
                  {tipo === "accesorio" ? "Accesorios" : "Colección"}
                </Link>
              </>
            )}
            {categoria && filtros.para && (
              <>
                {" / "}
                <Link href={`/${filtros.para}`} className="hover:text-negro">
                  {nombrePara}
                </Link>
              </>
            )}
          </nav>
          <div className={foto ? "mt-4 grid items-end gap-6 sm:grid-cols-[9rem_1fr]" : ""}>
            {foto && (
              <Foto imagen={foto} tono="topo" sinIlustracion className="aspect-[3/4] w-full sm:w-36" sizes="144px" />
            )}
            <div>
              <h1 className="titulo-display mt-3 text-5xl md:text-6xl">{tituloFinal}</h1>
              {descripcion && <p className="mt-3 text-lg">{descripcion}</p>}
            </div>
          </div>
        </header>

        <div className="mt-8 md:mt-10">
          {visibles.length > 0 ? (
            <RejillaProductos productos={visibles} />
          ) : (
            <div className="py-24 text-center">
              <p className="titulo-display text-3xl md:text-4xl">No encontramos modelos con esos filtros.</p>
              <Link href={limpiar} className="btn-contorno mt-8">
                Ver todo
              </Link>
            </div>
          )}
        </div>

        {tarjetas.length > visibles.length && (
          <div className="mt-12 text-center">
            <Link
              href={hrefColeccion(rutaBase, { ...filtros, pagina: filtros.pagina + 1 })}
              className="btn-contorno"
            >
              Cargar más
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function grupo(id: string, etiqueta: string, nombre: string, opciones: OpcionFiltro[], activos: string[]) {
  return { id, etiqueta, nombre, opciones, activos };
}

function chipsDe(filtros: FiltrosUrl, categorias: Categoria[], base: string) {
  const nombreEstilo = (slug: string) => categorias.find((c) => c.slug === slug)?.nombre ?? slug;
  const pieza = (clave: "estilos" | "tallas" | "colores" | "materiales" | "ocasiones", valor: string, texto: string) => ({
    texto,
    href: hrefColeccion(base, quitarValor(filtros, clave, valor)),
  });
  return [
    ...filtros.estilos.map((v) => pieza("estilos", v, nombreEstilo(v))),
    ...filtros.tallas.map((v) => pieza("tallas", v, etiquetaTalla(v))),
    ...filtros.colores.map((v) => pieza("colores", v, v)),
    ...filtros.materiales.map((v) => pieza("materiales", v, v)),
    ...filtros.ocasiones.map((v) => pieza("ocasiones", v, ETIQUETA_OCASION[v as Ocasion])),
  ];
}
