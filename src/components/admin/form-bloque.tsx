import type { DefinicionBloque } from "@/content/bloques";
import { guardarBloque, restaurarBloque } from "@/lib/actions/contenido";
import type { BloqueResuelto } from "@/lib/data/contenido";
import { Campo, CampoFoto } from "./campos";
import { FormAdmin } from "./form-admin";

/** Tarjeta para editar un cuadro de la portada o de Nuestra historia. */
export function FormBloque({
  def,
  bloque,
  personalizado,
}: {
  def: DefinicionBloque;
  bloque: BloqueResuelto;
  /** Si ya tiene cambios guardados (se puede restaurar) */
  personalizado: boolean;
}) {
  const usa = (c: (typeof def.campos)[number]) => def.campos.includes(c);

  return (
    <section className="border border-cafe/15 bg-white p-5 md:p-6" aria-labelledby={`titulo-${def.clave}`}>
      <header className="mb-5">
        <h2 id={`titulo-${def.clave}`} className="text-lg font-semibold">
          {def.nombre}
        </h2>
        <p className="mt-1 text-sm text-cafe/85">{def.ayuda}</p>
      </header>

      <FormAdmin action={guardarBloque} boton="Guardar" className="space-y-5">
        <input type="hidden" name="clave" value={def.clave} />
        {usa("imagen") && (
          <CampoFoto
            id={def.clave}
            actual={bloque.imagen?.url}
            alt={bloque.imagen?.alt}
            proporcion={def.proporcion}
            nota={def.notaFoto}
          />
        )}
        {usa("titulo") && (
          <Campo label={usa("imagen") && !usa("texto") ? "Texto sobre la foto (opcional)" : "Título"}>
            <input name="titulo" defaultValue={bloque.titulo} maxLength={160} className="campo" />
          </Campo>
        )}
        {usa("texto") && (
          <Campo label="Texto" ayuda="Frases cortas se leen mejor. Deja una línea en blanco para separar párrafos.">
            <textarea name="texto" rows={4} defaultValue={bloque.texto} maxLength={3000} className="campo" />
          </Campo>
        )}
        {usa("enlace") && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo label="Texto del botón" ayuda="Déjalo vacío para no mostrar botón.">
              <input name="enlaceTexto" defaultValue={bloque.enlaceTexto} maxLength={60} className="campo" />
            </Campo>
            <Campo label="A dónde lleva" ayuda="Ej. /coleccion o /coleccion/botas">
              <input name="enlaceUrl" defaultValue={bloque.enlaceUrl} className="campo" />
            </Campo>
          </div>
        )}
        {usa("imagen") && (
          <Campo label="Descripción de la foto" ayuda="Para personas con lectores de pantalla y para Google. Ej. «Mocasín café sobre piedra».">
            <input name="imagenAlt" defaultValue={bloque.imagen?.alt ?? ""} maxLength={200} className="campo" />
          </Campo>
        )}
      </FormAdmin>

      {personalizado && (
        <form action={restaurarBloque} className="mt-4 border-t border-cafe/10 pt-4">
          <input type="hidden" name="clave" value={def.clave} />
          <button type="submit" className="enlace text-sm">
            Regresar a los textos originales y quitar la foto
          </button>
        </form>
      )}
    </section>
  );
}
