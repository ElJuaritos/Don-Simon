"use client";

import type { Piel } from "@/db/schema";
import { borrarPiel, guardarPiel } from "@/lib/actions/pieles";
import { Campo, CampoFoto } from "./campos";
import { FormAdmin } from "./form-admin";

/** Crear, editar o quitar una piel. El orden menor aparece primero en /pieles. */
export function FormPiel({ piel }: { piel?: Piel }) {
  return (
    <div className="space-y-4">
      <FormAdmin action={guardarPiel} boton={piel ? "Guardar" : "Crear piel"} className="space-y-5">
        {piel && <input type="hidden" name="id" value={piel.id} />}
        <Campo label="Nombre">
          <input name="nombre" required defaultValue={piel?.nombre} className="campo" placeholder="Becerro" />
        </Campo>
        <Campo label="Descripción">
          <textarea name="descripcion" rows={3} defaultValue={piel?.descripcion} className="campo" />
        </Campo>
        <Campo label="Cómo cuidarla">
          <textarea name="cuidado" rows={3} defaultValue={piel?.cuidado} className="campo" />
        </Campo>
        <div className="grid gap-5 sm:grid-cols-2">
          <Campo label="Orden" ayuda="Las de número menor aparecen primero.">
            <input name="orden" type="number" min={0} defaultValue={piel?.orden ?? 0} className="campo max-w-28" />
          </Campo>
          <Campo label="Visible en la tienda">
            <label className="flex items-center gap-2 py-2">
              <input type="checkbox" name="activa" defaultChecked={piel?.activa ?? true} className="size-4" />
              Mostrar esta piel
            </label>
          </Campo>
        </div>
        <CampoFoto id={piel?.id ?? "nueva"} actual={piel?.imagenUrl} alt={piel?.nombre} proporcion="Vertical 4:5" nota="foto de la piel o del zapato" />
      </FormAdmin>
      {piel && (
        <form
          action={borrarPiel}
          onSubmit={(e) => {
            if (!confirm("¿Quitas esta piel?")) e.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={piel.id} />
          <button type="submit" className="enlace text-sm">
            Quitar esta piel
          </button>
        </form>
      )}
    </div>
  );
}
