import "server-only";
import { and, asc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { categorias, imagenes, productos, productosComplementarios, variantes, type Publico } from "@/db/schema";
import { etiquetaDeTalla } from "@/lib/formato";
import { disponibles, getProductos, type ProductoListado } from "./catalogo";

export type Sugerencia = {
  productoId: string;
  slug: string;
  nombre: string;
  precio: number;
  color: string;
  imagen: { url: string; alt: string } | null;
  /** Presente solo si hay una variante con existencias y es talla única. */
  varianteId: string | null;
};

/** Complementarios elegidos, o accesorios del mismo público si no hay ninguno con existencias. */
export async function tarjetasParaCombinar(producto: { id: string; publico: Publico }): Promise<ProductoListado[]> {
  const db = await getDb();
  const ligas = await db
    .select({ id: productosComplementarios.complementarioId })
    .from(productosComplementarios)
    .where(eq(productosComplementarios.productoId, producto.id))
    .orderBy(asc(productosComplementarios.orden));
  const ids = ligas.map((l) => l.id);
  const elegidas = ids.length ? await tarjetasEnOrden(ids) : [];
  if (elegidas.length > 0) return elegidas.slice(0, 6);

  const para = producto.publico === "unisex" ? undefined : producto.publico;
  const accesorios = await getProductos({ tipo: "accesorio", para });
  const vistos = new Set<string>();
  return accesorios.filter((t) => {
    if (t.id === producto.id || !t.disponible || vistos.has(t.id)) return false;
    vistos.add(t.id);
    return true;
  }).slice(0, 6);
}

/** Hasta 4 sugerencias para el carrito: primero lo ligado a lo que ya llevas. */
export async function sugerenciasDeCarrito(productoIds: string[]): Promise<Sugerencia[]> {
  const enCarrito = new Set(productoIds);
  const db = await getDb();
  const ligados = productoIds.length
    ? await db
        .select({
          id: productosComplementarios.complementarioId,
          orden: productosComplementarios.orden,
        })
        .from(productosComplementarios)
        .where(inArray(productosComplementarios.productoId, productoIds))
        .orderBy(asc(productosComplementarios.orden))
    : [];

  const ids: string[] = [];
  const visto = new Set<string>();
  for (const liga of ligados) {
    if (enCarrito.has(liga.id) || visto.has(liga.id)) continue;
    visto.add(liga.id);
    ids.push(liga.id);
  }

  if (ids.length < 4) {
    const extra = await db
      .select({ id: productos.id })
      .from(productos)
      .innerJoin(categorias, eq(productos.categoriaId, categorias.id))
      .where(and(eq(productos.estado, "activo"), eq(categorias.tipo, "accesorio")))
      .orderBy(asc(productos.nombre));
    for (const fila of extra) {
      if (ids.length >= 8) break;
      if (enCarrito.has(fila.id) || visto.has(fila.id)) continue;
      visto.add(fila.id);
      ids.push(fila.id);
    }
  }

  const sugerencias: Sugerencia[] = [];
  for (const id of ids) {
    if (sugerencias.length >= 4) break;
    const sugerencia = await armarSugerencia(id);
    if (sugerencia) sugerencias.push(sugerencia);
  }
  return sugerencias;
}

async function tarjetasEnOrden(ids: string[]) {
  const tarjetas = (await getProductos({ ids })).filter((t) => t.disponible);
  const puesto = new Map(ids.map((id, i) => [id, i]));
  return tarjetas.sort((a, b) => (puesto.get(a.id) ?? 0) - (puesto.get(b.id) ?? 0) || a.color.localeCompare(b.color, "es"));
}

async function armarSugerencia(productoId: string): Promise<Sugerencia | null> {
  const db = await getDb();
  const [producto] = await db
    .select()
    .from(productos)
    .where(and(eq(productos.id, productoId), eq(productos.estado, "activo")));
  if (!producto) return null;
  const vars = await db.select().from(variantes).where(and(eq(variantes.productoId, productoId), eq(variantes.activo, true)));
  const conStock = vars.filter((v) => disponibles(v) > 0);
  if (conStock.length === 0) return null;
  const directa = conStock.length === 1 && etiquetaDeTalla(conStock[0]) === "Talla única" ? conStock[0] : null;
  const color = (directa ?? conStock[0]).color;
  const fotos = await db.select().from(imagenes).where(eq(imagenes.productoId, productoId)).orderBy(asc(imagenes.orden));
  const foto = fotos.find((f) => f.color === color) ?? fotos.find((f) => !f.color) ?? fotos[0] ?? null;
  return {
    productoId: producto.id,
    slug: producto.slug,
    nombre: producto.nombre,
    precio: producto.precio,
    color,
    imagen: foto ? { url: foto.url, alt: foto.alt } : null,
    varianteId: directa?.id ?? null,
  };
}
