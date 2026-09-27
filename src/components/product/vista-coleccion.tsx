import Link from "next/link";
import type { Categoria } from "@/db/schema";
import { getOpcionesFiltro, getProductos, type Orden } from "@/lib/data/catalogo";
import { formatTalla } from "@/lib/formato";
import { RejillaProductos } from "./tarjeta-producto";

const ORDENES: { valor: Orden; texto: string }[] = [
  { valor: "destacados", texto: "Destacados" },
  { valor: "novedades", texto: "Novedades" },
  { valor: "precio-asc", texto: "Precio: menor a mayor" },
  { valor: "precio-desc", texto: "Precio: mayor a menor" },
];

export type FiltrosColeccion = { talla?: string; color?: string; orden?: string };

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
  const talla = filtros.talla ? Number(filtros.talla) : undefined;
  const orden = ORDENES.some((o) => o.valor === filtros.orden) ? (filtros.orden as Orden) : "destacados";
  const [productos, opciones] = await Promise.all([
    getProductos({
      categoriaSlug: categoria?.slug,
      talla: Number.isFinite(talla) ? talla : undefined,
      color: filtros.color || undefined,
      orden,
    }),
    getOpcionesFiltro(),
  ]);
  const hayFiltros = Boolean(filtros.talla || filtros.color);

  return (
    <div className="contenedor py-12 md:py-16">
      <header className="max-w-2xl">
        <nav aria-label="Migas de pan" className="text-sm text-cafe/85">
          <Link href="/" className="hover:text-cafe">
            Inicio
          </Link>
          {categoria && (
            <>
              {" / "}
              <Link href="/coleccion" className="hover:text-cafe">
                Colección
              </Link>
            </>
          )}
        </nav>
        <h1 className="titulo-display mt-3 text-5xl md:text-6xl">{titulo}</h1>
        {descripcion && <p className="mt-4 text-lg">{descripcion}</p>}
      </header>

      <nav aria-label="Categorías" className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/coleccion"
          className={`etiqueta border px-4 py-2 transition-colors ${!categoria ? "border-cafe bg-cafe text-crema-claro" : "border-cafe/25 hover:border-cafe"}`}
        >
          Todo
        </Link>
        {categorias.map((c) => (
          <Link
            key={c.id}
            href={`/coleccion/${c.slug}`}
            className={`etiqueta border px-4 py-2 transition-colors ${categoria?.id === c.id ? "border-cafe bg-cafe text-crema-claro" : "border-cafe/25 hover:border-cafe"}`}
          >
            {c.nombre}
          </Link>
        ))}
      </nav>

      {/* Filtros: formulario GET, funciona sin JavaScript */}
      <form
        method="get"
        action={rutaBase}
        className="mt-6 flex flex-wrap items-end gap-3 border-y border-cafe/10 py-4"
      >
        <div>
          <label htmlFor="f-talla" className="campo-label text-xs">
            Talla (MX)
          </label>
          <select id="f-talla" name="talla" defaultValue={filtros.talla ?? ""} className="campo min-w-28 py-2">
            <option value="">Todas</option>
            {opciones.tallas.map((t) => (
              <option key={t} value={t}>
                {formatTalla(t)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-color" className="campo-label text-xs">
            Color
          </label>
          <select id="f-color" name="color" defaultValue={filtros.color ?? ""} className="campo min-w-32 py-2">
            <option value="">Todos</option>
            {opciones.colores.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="f-orden" className="campo-label text-xs">
            Ordenar
          </label>
          <select id="f-orden" name="orden" defaultValue={orden} className="campo min-w-48 py-2">
            {ORDENES.map((o) => (
              <option key={o.valor} value={o.valor}>
                {o.texto}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn-primario min-h-11">
          Aplicar
        </button>
        {hayFiltros && (
          <Link href={rutaBase} className="enlace ml-1 self-center text-sm">
            Quitar filtros
          </Link>
        )}
        <p className="ml-auto self-center text-sm text-cafe/85">
          {productos.length} {productos.length === 1 ? "modelo" : "modelos"}
        </p>
      </form>

      <div className="mt-10">
        {productos.length > 0 ? (
          <RejillaProductos productos={productos} />
        ) : (
          <div className="py-20 text-center">
            <p className="titulo-display text-3xl">No encontramos modelos con esos filtros.</p>
            <Link href={rutaBase} className="btn-contorno mt-6">
              Ver todo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
