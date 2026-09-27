import type { Categoria, Horma, Producto } from "@/db/schema";
import { guardarProducto } from "@/lib/actions/admin";
import { FormAdmin } from "./form-admin";

const pesos = (centavos: number | null | undefined) => (centavos == null ? "" : String(centavos / 100));

function Campo({ label, ayuda, children }: { label: string; ayuda?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="campo-label">{label}</span>
      {children}
      {ayuda && <span className="mt-1 block text-xs text-cafe/85">{ayuda}</span>}
    </label>
  );
}

export function FormProducto({
  producto,
  categorias,
  hormas,
}: {
  producto?: Producto;
  categorias: Categoria[];
  hormas: Horma[];
}) {
  return (
    <FormAdmin action={guardarProducto} boton={producto ? "Guardar cambios" : "Crear producto"} className="space-y-5">
      {producto && <input type="hidden" name="id" value={producto.id} />}

      <div className="grid gap-5 md:grid-cols-2">
        <Campo label="Nombre">
          <input name="nombre" required defaultValue={producto?.nombre} className="campo" placeholder="Mocasín Alameda" />
        </Campo>
        <Campo label="Dirección web" ayuda="Se genera sola a partir del nombre si la dejas vacía.">
          <input name="slug" defaultValue={producto?.slug} className="campo" placeholder="mocasin-alameda" />
        </Campo>
        <Campo label="Categoría">
          <select name="categoriaId" required defaultValue={producto?.categoriaId ?? ""} className="campo">
            <option value="" disabled>
              Elige una
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Horma" ayuda="Define la recomendación de talla que ve el cliente.">
          <select name="hormaId" defaultValue={producto?.hormaId ?? ""} className="campo">
            <option value="">Sin especificar</option>
            {hormas.map((h) => (
              <option key={h.id} value={h.id}>
                {h.nombre} — {h.recomendacion}
              </option>
            ))}
          </select>
        </Campo>
        <Campo label="Precio (MXN, con IVA)">
          <input name="precio" required inputMode="decimal" defaultValue={pesos(producto?.precio)} className="campo" placeholder="3490" />
        </Campo>
        <Campo label="Precio anterior (opcional)" ayuda="Si lo llenas, el producto aparece como oferta.">
          <input name="precioComparacion" inputMode="decimal" defaultValue={pesos(producto?.precioComparacion)} className="campo" />
        </Campo>
      </div>

      <Campo label="Descripción">
        <textarea name="descripcion" rows={4} defaultValue={producto?.descripcion} className="campo" />
      </Campo>

      <div className="grid gap-5 md:grid-cols-2">
        <Campo label="Materiales">
          <textarea name="materiales" rows={2} defaultValue={producto?.materiales} className="campo" placeholder="Piel de becerro curtida al vegetal…" />
        </Campo>
        <Campo label="Cuidado">
          <textarea name="cuidado" rows={2} defaultValue={producto?.cuidado} className="campo" />
        </Campo>
        <Campo label="Construcción">
          <input name="construccion" defaultValue={producto?.construccion} className="campo" placeholder="Cosido Blake" />
        </Campo>
        <Campo label="Suela">
          <input name="suela" defaultValue={producto?.suela} className="campo" placeholder="Suela de cuero" />
        </Campo>
        <Campo label="Origen">
          <input name="hechoEn" defaultValue={producto?.hechoEn ?? "Hecho a mano en México"} className="campo" />
        </Campo>
        <Campo label="Estado" ayuda="Solo los productos Activos se ven en la tienda.">
          <select name="estado" defaultValue={producto?.estado ?? "borrador"} className="campo">
            <option value="borrador">Borrador (oculto)</option>
            <option value="activo">Activo (visible)</option>
            <option value="archivado">Archivado</option>
          </select>
        </Campo>
      </div>

      <label className="flex items-center gap-3">
        <input type="checkbox" name="destacado" defaultChecked={producto?.destacado} className="h-5 w-5 accent-cafe" />
        <span className="font-semibold">Mostrar en la portada (destacado)</span>
      </label>
    </FormAdmin>
  );
}
