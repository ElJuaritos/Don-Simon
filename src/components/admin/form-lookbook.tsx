import type { LookbookFoto } from "@/db/schema";
import { PUBLICOS } from "@/db/schema";
import { guardarLookbookFoto } from "@/lib/actions/lookbook";
import { Campo, CampoFoto } from "./campos";
import { ConfirmarQuitar } from "./confirmar-quitar";
import { FormAdmin } from "./form-admin";

const PUBLICO: Record<(typeof PUBLICOS)[number], string> = {
  hombre: "Hombre",
  mujer: "Mujer",
  unisex: "Ambos",
};

/** Crear o editar una foto del lookbook, y ligarla a un modelo si hace falta. */
export function FormLookbook({
  foto,
  productos,
  ordenSiguiente = 1,
}: {
  foto?: LookbookFoto;
  productos: { id: string; nombre: string }[];
  ordenSiguiente?: number;
}) {
  const id = foto?.id ?? "nueva";
  return (
    <div>
      <FormAdmin action={guardarLookbookFoto} boton={foto ? "Guardar" : "Agregar foto"} className="space-y-5">
        {foto && <input type="hidden" name="id" value={foto.id} />}
        <CampoFoto
          id={id}
          actual={foto?.imagenUrl}
          alt={foto?.alt}
          proporcion="Vertical 3:4 o horizontal 16:9"
          nota="calzado de piel con luz natural"
        />
        <Campo label="Descripción de la foto" ayuda="Para personas con lectores de pantalla. Ej. «Mocasín café sobre piedra».">
          <input name="alt" required defaultValue={foto?.alt} maxLength={200} className="campo" />
        </Campo>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo label="Se ve en">
            <select name="publico" defaultValue={foto?.publico ?? "hombre"} className="campo">
              {PUBLICOS.map((p) => (
                <option key={p} value={p}>
                  {PUBLICO[p]}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Orden" ayuda="El 1 aparece primero.">
            <input name="orden" type="number" min={0} defaultValue={foto?.orden ?? ordenSiguiente} className="campo max-w-28" />
          </Campo>
        </div>
        <Campo label="Ver el modelo" ayuda="Si esta foto muestra un zapato de la tienda, elígelo. Si no, déjalo en «Ninguno».">
          <select name="productoId" defaultValue={foto?.productoId ?? ""} className="campo">
            <option value="">Ninguno</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" name="activa" defaultChecked={foto?.activa ?? true} className="h-4 w-4 accent-negro" />
          Mostrar en el lookbook
        </label>
      </FormAdmin>
      {foto && (
        <div className="mt-4 border-t border-negro/10 pt-4">
          <ConfirmarQuitar id={foto.id} />
        </div>
      )}
    </div>
  );
}
