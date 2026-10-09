import "server-only";
import { and, asc, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import {
  categorias,
  hormas,
  imagenes,
  productos,
  variantes,
  type Categoria,
  type Ocasion,
  type Producto,
  type Publico,
  type TipoCategoria,
  type Variante,
} from "@/db/schema";
import { etiquetaDeTalla } from "@/lib/formato";

export type Orden = "destacados" | "novedades" | "precio-asc" | "precio-desc";

const DIAS_NUEVO = 60;

export type ProductoListado = Producto & {
  categoria: Pick<Categoria, "nombre" | "slug">;
  /** Una tarjeta por color: foto de ese color, o la general si no hay. */
  imagen: { url: string; alt: string } | null;
  imagenSecundaria: { url: string; alt: string } | null;
  color: string;
  colorHex: string;
  /** Clave de filtro: "25.5", "85 cm" o "Única". */
  tallasDisponibles: string[];
  disponible: boolean;
  ultimosPares: boolean;
  nuevo: boolean;
};

export type OpcionesFiltro = {
  estilos: { slug: string; nombre: string }[];
  tallas: string[];
  colores: string[];
  materiales: string[];
  ocasiones: Ocasion[];
};

export type FiltrosListado = {
  categoriaSlug?: string;
  /** Solo calzado o solo accesorios. Sin valor, la búsqueda incluye los dos. */
  tipo?: TipoCategoria;
  para?: Exclude<Publico, "unisex">;
  talla?: string | string[];
  color?: string | string[];
  material?: string | string[];
  ocasion?: string | string[];
  estilo?: string | string[];
  orden?: Orden;
  q?: string;
  soloDestacados?: boolean;
  limite?: number;
  ids?: string[];
};

type Facetas = {
  estilos: string[];
  tallas: string[];
  colores: string[];
  materiales: string[];
  ocasiones: string[];
};

export function disponibles(v: Pick<Variante, "stock" | "stockApartado" | "activo">) {
  return v.activo ? Math.max(0, v.stock - v.stockApartado) : 0;
}

/** Foto de categoría según el público. imagen_url es el respaldo. */
export function fotoDeCategoria(
  cat: { imagenUrl: string | null; imagenHombreUrl: string | null; imagenMujerUrl: string | null; nombre: string },
  para?: "hombre" | "mujer",
) {
  const url = para === "hombre" ? cat.imagenHombreUrl || cat.imagenUrl : para === "mujer" ? cat.imagenMujerUrl || cat.imagenUrl : cat.imagenUrl;
  return url ? { url, alt: cat.nombre } : null;
}

export async function getCategorias() {
  const db = await getDb();
  return db.select().from(categorias).orderBy(asc(categorias.orden), asc(categorias.nombre));
}

/** Categorías con al menos un producto activo de ese público. Por defecto, solo calzado. */
export async function getCategoriasPara(para: "hombre" | "mujer", tipo: TipoCategoria = "calzado") {
  const db = await getDb();
  return db
    .selectDistinct({
      id: categorias.id,
      nombre: categorias.nombre,
      slug: categorias.slug,
      orden: categorias.orden,
      imagenUrl: categorias.imagenUrl,
      imagenHombreUrl: categorias.imagenHombreUrl,
      imagenMujerUrl: categorias.imagenMujerUrl,
    })
    .from(categorias)
    .innerJoin(productos, eq(productos.categoriaId, categorias.id))
    .where(and(eq(productos.estado, "activo"), eq(categorias.tipo, tipo), inArray(productos.publico, [para, "unisex"])))
    .orderBy(asc(categorias.orden), asc(categorias.nombre));
}

export async function getCategoria(slug: string) {
  const db = await getDb();
  const [cat] = await db.select().from(categorias).where(eq(categorias.slug, slug));
  return cat ?? null;
}

export async function getMaterialesUsados() {
  const db = await getDb();
  const filas = await db.selectDistinct({ material: productos.material }).from(productos);
  return filas.map((f) => f.material.trim()).filter(Boolean).sort((a, b) => a.localeCompare(b, "es"));
}

function nums(valor: string | string[] | undefined) {
  if (!valor) return [];
  return textos(valor);
}

function ordenTalla(a: string, b: string) {
  if (a === "Única") return 1;
  if (b === "Única") return -1;
  const na = Number(a);
  const nb = Number(b);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
  return a.localeCompare(b, "es");
}

/** Clave del filtro de talla. "Única" se oculta cuando todo el catálogo es así. */
function claveDeTalla(v: { talla: number | null; etiquetaTalla: string | null }) {
  const etiqueta = etiquetaDeTalla(v);
  return etiqueta === "Talla única" ? "Única" : etiqueta;
}

function textos(valor: string | string[] | undefined) {
  if (!valor) return [];
  return (Array.isArray(valor) ? valor : [valor]).map((v) => v.trim()).filter(Boolean);
}

function encaja(tarjeta: ProductoListado, facetas: Facetas, excepto?: keyof Facetas) {
  if (excepto !== "estilos" && facetas.estilos.length > 0 && !facetas.estilos.includes(tarjeta.categoria.slug)) return false;
  if (excepto !== "tallas" && facetas.tallas.length > 0 && !tarjeta.tallasDisponibles.some((t) => facetas.tallas.includes(t))) return false;
  if (excepto !== "colores" && facetas.colores.length > 0 && !facetas.colores.includes(tarjeta.color)) return false;
  if (excepto !== "materiales" && facetas.materiales.length > 0 && !facetas.materiales.includes(tarjeta.material)) return false;
  if (excepto !== "ocasiones" && facetas.ocasiones.length > 0 && !tarjeta.ocasiones.some((o) => facetas.ocasiones.includes(o))) return false;
  return true;
}

function unicos<T>(valores: T[], ordenar: (a: T, b: T) => number = () => 0) {
  return [...new Set(valores)].sort(ordenar);
}

function opcionesDe(tarjetas: ProductoListado[], facetas: Facetas): OpcionesFiltro {
  const de = (excepto: keyof Facetas) => tarjetas.filter((t) => encaja(t, facetas, excepto));
  const estilos = unicos(de("estilos").map((t) => `${t.categoria.slug}\u0000${t.categoria.nombre}`))
    .map((par) => {
      const [slug, nombre] = par.split("\u0000");
      return { slug, nombre };
    })
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  return {
    estilos,
    tallas: unicos(de("tallas").flatMap((t) => t.tallasDisponibles), ordenTalla),
    colores: unicos(de("colores").map((t) => t.color), (a, b) => a.localeCompare(b, "es")),
    materiales: unicos(
      de("materiales").map((t) => t.material).filter(Boolean),
      (a, b) => a.localeCompare(b, "es"),
    ),
    ocasiones: unicos(de("ocasiones").flatMap((t) => t.ocasiones)) as Ocasion[],
  };
}

async function cargarTarjetas(filtros: Pick<FiltrosListado, "para" | "q" | "soloDestacados" | "tipo" | "ids">) {
  const db = await getDb();
  const condiciones: SQL[] = [eq(productos.estado, "activo")];
  if (filtros.tipo) condiciones.push(eq(categorias.tipo, filtros.tipo));
  if (filtros.ids?.length) condiciones.push(inArray(productos.id, filtros.ids));
  if (filtros.soloDestacados) condiciones.push(eq(productos.destacado, true));
  if (filtros.para) condiciones.push(inArray(productos.publico, [filtros.para, "unisex"]));
  if (filtros.q) {
    const q = `%${filtros.q}%`;
    condiciones.push(or(ilike(productos.nombre, q), ilike(productos.descripcion, q), ilike(categorias.nombre, q))!);
  }

  const filas = await db
    .select({ producto: productos, categoria: { nombre: categorias.nombre, slug: categorias.slug } })
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(and(...condiciones));

  if (filas.length === 0) return [];
  const ids = filas.map((f) => f.producto.id);
  const [vars, imgs] = await Promise.all([
    db.select().from(variantes).where(inArray(variantes.productoId, ids)),
    db.select().from(imagenes).where(inArray(imagenes.productoId, ids)).orderBy(asc(imagenes.orden)),
  ]);
  const ahora = Date.now();

  return filas.flatMap(({ producto, categoria }) => {
    const propias = vars.filter((v) => v.productoId === producto.id && v.activo);
    const colores = new Map<string, string>();
    for (const v of propias) if (!colores.has(v.color)) colores.set(v.color, v.colorHex);
    const nuevo = ahora - new Date(producto.createdAt).getTime() < DIAS_NUEVO * 86_400_000;
    return [...colores].map(([color, colorHex]) => {
      const delColor = propias.filter((v) => v.color === color);
      const conStock = delColor.filter((v) => disponibles(v) > 0);
      const fotosColor = imgs.filter((i) => i.productoId === producto.id && i.color === color);
      const fotosGenerales = imgs.filter((i) => i.productoId === producto.id && !i.color);
      const fotos = fotosColor.length > 0 ? fotosColor : fotosGenerales;
      const total = conStock.reduce((s, v) => s + disponibles(v), 0);
      return {
        ...producto,
        categoria,
        imagen: fotos[0] ? { url: fotos[0].url, alt: fotos[0].alt } : null,
        imagenSecundaria: fotos[1] ? { url: fotos[1].url, alt: fotos[1].alt } : null,
        color,
        colorHex,
        tallasDisponibles: [...new Set(conStock.map(claveDeTalla))].sort(ordenTalla),
        disponible: conStock.length > 0,
        ultimosPares: total > 0 && total <= 5,
        nuevo,
      };
    });
  });
}

function ordenar(tarjetas: ProductoListado[], orden: Orden | undefined) {
  const copia = [...tarjetas];
  copia.sort((a, b) => {
    const porNombre = a.nombre.localeCompare(b.nombre, "es") || a.color.localeCompare(b.color, "es");
    if (orden === "precio-asc") return a.precio - b.precio || porNombre;
    if (orden === "precio-desc") return b.precio - a.precio || porNombre;
    if (orden === "novedades") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() || porNombre;
    return Number(b.destacado) - Number(a.destacado) || porNombre;
  });
  return copia;
}

function facetasDe(filtros: FiltrosListado): Facetas {
  const estilos = [...textos(filtros.estilo), ...(filtros.categoriaSlug ? [filtros.categoriaSlug] : [])];
  return {
    estilos: [...new Set(estilos)],
    tallas: nums(filtros.talla),
    colores: textos(filtros.color),
    materiales: textos(filtros.material),
    ocasiones: textos(filtros.ocasion),
  };
}

export async function getProductos(filtros: FiltrosListado = {}): Promise<ProductoListado[]> {
  const tarjetas = await cargarTarjetas(filtros);
  const facetas = facetasDe(filtros);
  const lista = ordenar(
    tarjetas.filter((t) => encaja(t, facetas)),
    filtros.orden,
  );
  return filtros.limite ? lista.slice(0, filtros.limite) : lista;
}

/** Tarjetas ya filtradas y las opciones de cada filtro (sin contar el propio, para poder sumar otro valor). */
export async function getCatalogo(filtros: FiltrosListado = {}) {
  const tarjetas = await cargarTarjetas(filtros);
  const facetas = facetasDe(filtros);
  return {
    tarjetas: ordenar(
      tarjetas.filter((t) => encaja(t, facetas)),
      filtros.orden,
    ),
    opciones: opcionesDe(tarjetas, facetas),
  };
}

export async function getProducto(slug: string) {
  const db = await getDb();
  const [fila] = await db
    .select({ producto: productos, categoria: categorias, horma: hormas })
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .leftJoin(hormas, eq(productos.hormaId, hormas.id))
    .where(and(eq(productos.slug, slug), eq(productos.estado, "activo")));
  if (!fila) return null;

  const [vars, imgs] = await Promise.all([
    db
      .select()
      .from(variantes)
      .where(and(eq(variantes.productoId, fila.producto.id), eq(variantes.activo, true)))
      .orderBy(asc(variantes.color), asc(variantes.talla)),
    db
      .select()
      .from(imagenes)
      .where(eq(imagenes.productoId, fila.producto.id))
      .orderBy(asc(imagenes.orden)),
  ]);

  return { ...fila.producto, categoria: fila.categoria, horma: fila.horma, variantes: vars, imagenes: imgs };
}

export type ProductoDetalle = NonNullable<Awaited<ReturnType<typeof getProducto>>>;

/** Hay al menos un accesorio activo: entonces se muestra el enlace del menú. */
export async function hayAccesoriosActivos() {
  const db = await getDb();
  const [fila] = await db
    .select({ id: productos.id })
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(and(eq(productos.estado, "activo"), eq(categorias.tipo, "accesorio")))
    .limit(1);
  return Boolean(fila);
}
