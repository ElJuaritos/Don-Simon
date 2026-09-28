import type { Horma } from "@/db/schema";
import { guardarHorma } from "@/lib/actions/contenido";
import { Campo, CampoFoto } from "./campos";
import { FormAdmin } from "./form-admin";

/** Crear o editar una horma (aparece en la página "Nuestras hormas" y en cada producto). */
export function FormHorma({ horma }: { horma?: Horma }) {
  const id = horma?.id ?? "nueva";
  return (
    <FormAdmin action={guardarHorma} boton={horma ? "Guardar" : "Crear horma"} className="space-y-5">
      {horma && <input type="hidden" name="id" value={horma.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo label="Nombre">
          <input name="nombre" required defaultValue={horma?.nombre} className="campo" placeholder="Horma Clásica" />
        </Campo>
        <Campo label="Ancho">
          <select name="ancho" defaultValue={horma?.ancho ?? "estandar"} className="campo">
            <option value="estandar">Estándar</option>
            <option value="ancho">Amplia</option>
          </select>
        </Campo>
      </div>
      <Campo label="Recomendación de talla" ayuda="La ve el cliente junto al selector de talla.">
        <input
          name="recomendacion"
          required
          defaultValue={horma?.recomendacion}
          className="campo"
          placeholder="Pide tu talla de siempre."
        />
      </Campo>
      <Campo label="Descripción" ayuda="Cómo se siente: puntera, empeine, talón. Aparece en Nuestras hormas.">
        <textarea name="descripcion" rows={3} defaultValue={horma?.descripcion} className="campo" />
      </Campo>
      <Campo label="Orden" ayuda="Las de número menor aparecen primero.">
        <input name="orden" type="number" min={0} defaultValue={horma?.orden ?? 0} className="campo max-w-28" />
      </Campo>
      <CampoFoto id={id} actual={horma?.imagenUrl} alt={horma?.nombre} proporcion="Vertical 4:5" nota="foto de la horma" />
    </FormAdmin>
  );
}
