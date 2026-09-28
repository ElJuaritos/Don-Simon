import "server-only";
import { and, asc, desc, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { getDb } from "@/db";
import {
  categorias,
  hormas,
  imagenes,
  productos,
  variantes,
  type Categoria,
  type Imagen,
  type Producto,
  type Publico,
  type Variante,
} from "@/db/schema";

export type ColorResumen = { nombre: string; hex: string };

export type ProductoListado = Producto & {
  categoria: Pick<Categoria, "nombre" | "slug">;
  imagen: Imagen | null;
  colores: ColorResumen[];
  tallasDisponibles: number[];
  disponible: boolean;
  /** Pocos pares en total */
  ultimosPares: boolean;
};

export type Orden = "destacados" | "novedades" | "precio-asc" | "precio-desc";

export function disponibles(v: Pick<Variante, "stock" | "stockApartado" | "activo">) {
  return v.activo ? Math.max(0, v.stock - v.stockApartado) : 0;
}

export async function getCategorias() {
  const db = await getDb();
  return db.select().from(categorias).orderBy(asc(categorias.orden), asc(categorias.nombre));
}

export async function getCategoria(slug: string) {
  const db = await getDb();
  const [cat] = await db.select().from(categorias).where(eq(categorias.slug, slug));
  return cat ?? null;
}

export async function getProductos(
  filtros: {
    categoriaSlug?: string;
    /** "hombre" o "mujer": incluye también los modelos unisex */
    para?: Exclude<Publico, "unisex">;
    talla?: number;
    color?: string;
    orden?: Orden;
    q?: string;
    soloDestacados?: boolean;
    limite?: number;
  } = {},
): Promise<ProductoListado[]> {
  const db = await getDb();
  const condiciones: SQL[] = [eq(productos.estado, "activo")];
  if (filtros.categoriaSlug) condiciones.push(eq(categorias.slug, filtros.categoriaSlug));
  if (filtros.soloDestacados) condiciones.push(eq(productos.destacado, true));
  if (filtros.para) condiciones.push(inArray(productos.publico, [filtros.para, "unisex"]));
  if (filtros.q) {
    const q = `%${filtros.q}%`;
    condiciones.push(
      or(ilike(productos.nombre, q), ilike(productos.descripcion, q), ilike(categorias.nombre, q))!,
    );
  }

  const orden =
    filtros.orden === "precio-asc"
      ? [asc(productos.precio)]
      : filtros.orden === "precio-desc"
        ? [desc(productos.precio)]
        : filtros.orden === "novedades"
          ? [desc(productos.createdAt)]
          : [desc(productos.destacado), asc(categorias.orden), asc(productos.nombre)];

  const filas = await db
    .select({ producto: productos, categoria: { nombre: categorias.nombre, slug: categorias.slug } })
    .from(productos)
    .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
    .where(and(...condiciones))
    .orderBy(...orden);

  if (filas.length === 0) return [];
  const ids = filas.map((f) => f.producto.id);
  const [vars, imgs] = await Promise.all([
    db.select().from(variantes).where(inArray(variantes.productoId, ids)),
    db.select().from(imagenes).where(inArray(imagenes.productoId, ids)).orderBy(asc(imagenes.orden)),
  ]);

  const activasPorProducto = Map.groupBy(
    vars.filter((v) => v.activo),
    (v) => v.productoId,
  );

  let lista: ProductoListado[] = filas.map(({ producto, categoria }) => {
    const propias = activasPorProducto.get(producto.id) ?? [];
    const conStock = propias.filter((v) => disponibles(v) > 0);
    const colores = new Map<string, string>();
    for (const v of propias) if (!colores.has(v.color)) colores.set(v.color, v.colorHex);
    const totalPares = conStock.reduce((s, v) => s + disponibles(v), 0);
    return {
      ...producto,
      categoria,
      imagen: imgs.find((i) => i.productoId === producto.id) ?? null,
      colores: [...colores].map(([nombre, hex]) => ({ nombre, hex })),
      tallasDisponibles: [...new Set(conStock.map((v) => v.talla))].sort((a, b) => a - b),
      disponible: conStock.length > 0,
      ultimosPares: totalPares > 0 && totalPares <= 5,
    };
  });

  if (filtros.talla !== undefined) {
    lista = lista.filter((p) =>
      (activasPorProducto.get(p.id) ?? []).some(
        (v) =>
          v.talla === filtros.talla &&
          disponibles(v) > 0 &&
          (!filtros.color || v.color === filtros.color),
      ),
    );
  } else if (filtros.color) {
    lista = lista.filter((p) => p.colores.some((c) => c.nombre === filtros.color));
  }

  return filtros.limite ? lista.slice(0, filtros.limite) : lista;
}

/** Tallas y colores que existen en el catálogo activo, para los filtros */
export async function getOpcionesFiltro() {
  const db = await getDb();
  const filas = await db
    .selectDistinct({ talla: variantes.talla, color: variantes.color })
    .from(variantes)
    .innerJoin(productos, eq(variantes.productoId, productos.id))
    .where(and(eq(productos.estado, "activo"), eq(variantes.activo, true)));
  return {
    tallas: [...new Set(filas.map((f) => f.talla))].sort((a, b) => a - b),
    colores: [...new Set(filas.map((f) => f.color))].sort(),
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
