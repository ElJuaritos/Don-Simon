import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { hormas, imagenes, productos, variantes } from "@/db/schema";
import { agregarVariantes, eliminarImagen, guardarInventario, hacerPrincipal, subirImagenes } from "@/lib/actions/admin";
import { getCategorias } from "@/lib/data/catalogo";
import { formatTalla } from "@/lib/formato";
import { FormAdmin } from "@/components/admin/form-admin";
import { FormProducto } from "@/components/admin/form-producto";
import { Tarjeta, TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Editar producto" };

export default async function EditarProducto({ params, searchParams }: PageProps<"/admin/productos/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!z.uuid().safeParse(id).success) notFound();

  const db = await getDb();
  const [[producto], cats, listaHormas, vars, imgs] = await Promise.all([
    db.select().from(productos).where(eq(productos.id, id)),
    getCategorias(),
    db.select().from(hormas),
    db.select().from(variantes).where(eq(variantes.productoId, id)).orderBy(asc(variantes.color), asc(variantes.talla)),
    db.select().from(imagenes).where(eq(imagenes.productoId, id)).orderBy(asc(imagenes.orden)),
  ]);
  if (!producto) notFound();

  const porColor = Map.groupBy(vars, (v) => v.color);
  const colores = [...porColor.keys()];

  return (
    <>
      <Link href="/admin/productos" className="enlace text-sm">
        ← Productos
      </Link>
      <div className="mt-3">
        <TituloAdmin
          accion={
            producto.estado === "activo" && (
              <Link href={`/producto/${producto.slug}`} target="_blank" className="btn-contorno">
                Ver en la tienda ↗
              </Link>
            )
          }
        >
          {producto.nombre}
        </TituloAdmin>
      </div>

      {sp.nuevo && (
        <p className="mb-6 bg-crema px-4 py-3" role="status">
          ✓ Producto creado. Ahora agrega sus colores y tallas, y súbele fotos. Cuando esté listo, cámbialo a <strong>Activo</strong>.
        </p>
      )}

      <div className="grid max-w-6xl gap-6">
        <Tarjeta titulo="Datos generales">
          <FormProducto producto={producto} categorias={cats} hormas={listaHormas} />
        </Tarjeta>

        <Tarjeta titulo="Inventario por talla" className="scroll-mt-6">
          <div id="inventario" />
          {vars.length === 0 ? (
            <p className="text-cafe/85">Este producto aún no tiene tallas. Agrégalas abajo.</p>
          ) : (
            <FormAdmin action={guardarInventario} boton="Guardar inventario">
              <input type="hidden" name="productoId" value={producto.id} />
              <div className="space-y-6">
                {[...porColor].map(([color, lista]) => (
                  <fieldset key={color}>
                    <legend className="mb-3 flex items-center gap-2 font-semibold">
                      <span className="h-4 w-4 rounded-full border border-cafe/20" style={{ backgroundColor: lista[0].colorHex }} />
                      {color}
                    </legend>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
                      {lista.map((v) => (
                        <div key={v.id} className={`border p-2 ${v.activo ? "border-cafe/20" : "border-dashed border-cafe/20 opacity-60"}`}>
                          <label htmlFor={`stock_${v.id}`} className="block text-center text-sm font-semibold">
                            {formatTalla(v.talla)}
                          </label>
                          <input
                            id={`stock_${v.id}`}
                            name={`stock_${v.id}`}
                            type="number"
                            min={v.stockApartado}
                            defaultValue={v.stock}
                            className="campo mt-1 px-2 py-1.5 text-center"
                            aria-describedby={v.stockApartado ? `ap_${v.id}` : undefined}
                          />
                          {v.stockApartado > 0 && (
                            <p id={`ap_${v.id}`} className="mt-1 text-center text-[0.6875rem] text-terracota-oscuro">
                              {v.stockApartado} apartado{v.stockApartado > 1 && "s"}
                            </p>
                          )}
                          <label className="mt-1.5 flex items-center justify-center gap-1 text-[0.6875rem]">
                            <input type="checkbox" name={`activo_${v.id}`} defaultChecked={v.activo} className="accent-cafe" />
                            Visible
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              <p className="mt-4 text-xs text-cafe/85">
                Los pares <em>apartados</em> pertenecen a pedidos que esperan pago; se descuentan solos cuando se paga o se liberan si el pago vence.
              </p>
            </FormAdmin>
          )}
        </Tarjeta>

        <Tarjeta titulo="Agregar color y tallas">
          <FormAdmin action={agregarVariantes} boton="Agregar tallas" botonClase="btn-contorno">
            <input type="hidden" name="productoId" value={producto.id} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              <label className="block lg:col-span-2">
                <span className="campo-label">Color</span>
                <input name="color" required list="colores-existentes" className="campo" placeholder="Café" />
                <datalist id="colores-existentes">
                  {colores.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
              <label className="block">
                <span className="campo-label">Muestra</span>
                <input name="colorHex" type="color" defaultValue="#5d3f24" className="h-12 w-full cursor-pointer border border-cafe/25 bg-white p-1" />
              </label>
              <label className="block">
                <span className="campo-label">Talla desde</span>
                <input name="tallaDesde" type="number" step="0.5" defaultValue={25} required className="campo" />
              </label>
              <label className="block">
                <span className="campo-label">Talla hasta</span>
                <input name="tallaHasta" type="number" step="0.5" defaultValue={29} required className="campo" />
              </label>
              <label className="block">
                <span className="campo-label">Pares por talla</span>
                <input name="stock" type="number" min={0} defaultValue={0} required className="campo" />
              </label>
            </div>
            <label className="mt-4 flex items-center gap-3">
              <input type="checkbox" name="medias" defaultChecked className="h-5 w-5 accent-cafe" />
              Incluir medias tallas (25.5, 26.5…)
            </label>
          </FormAdmin>
        </Tarjeta>

        <Tarjeta titulo="Fotos">
          {imgs.length > 0 && (
            <ul className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {imgs.map((img, i) => (
                <li key={img.id} className="border border-cafe/15">
                  <div className="relative aspect-[4/5] bg-crema-claro">
                    <Image src={img.url} alt={img.alt} fill sizes="200px" className="object-cover" />
                    {i === 0 && <span className="etiqueta absolute left-2 top-2 bg-cafe px-2 py-0.5 text-[0.625rem] text-crema-claro">Principal</span>}
                  </div>
                  <div className="space-y-1 p-2 text-xs">
                    <p className="text-cafe/85">{img.color ?? "Todos los colores"}</p>
                    <div className="flex justify-between gap-2">
                      {i > 0 && (
                        <form action={hacerPrincipal}>
                          <input type="hidden" name="id" value={img.id} />
                          <button type="submit" className="enlace">Hacer principal</button>
                        </form>
                      )}
                      <form action={eliminarImagen} className="ml-auto">
                        <input type="hidden" name="id" value={img.id} />
                        <button type="submit" className="enlace text-terracota-oscuro">Eliminar</button>
                      </form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <FormAdmin action={subirImagenes} boton="Subir fotos" botonClase="btn-contorno">
            <input type="hidden" name="productoId" value={producto.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="campo-label">Imágenes</span>
                <input name="archivos" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple required className="campo py-2.5" />
                <span className="mt-1 block text-xs text-cafe/85">JPG, PNG o WebP de hasta 8 MB. Proporción 4:5 recomendada.</span>
              </label>
              <label className="block">
                <span className="campo-label">¿De qué color?</span>
                <select name="color" className="campo">
                  <option value="">Todos los colores</option>
                  {colores.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
            </div>
          </FormAdmin>
        </Tarjeta>
      </div>
    </>
  );
}
