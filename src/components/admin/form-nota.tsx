"use client";

import { useState } from "react";
import { CuerpoNota } from "@/components/tienda/cuerpo-nota";
import { slugify } from "@/lib/formato";
import { guardarNota } from "@/lib/actions/notas";
import { Campo, CampoFoto } from "./campos";
import { FormAdmin } from "./form-admin";

const AYUDA_CUERPO =
  "Separa los párrafos con una línea en blanco. Para un subtítulo, empieza la línea con ##. Para una lista, empieza cada línea con un guion.";

/** Crear o editar una nota, con el enlace generado del título y una vista previa del cuerpo. */
export function FormNota({
  nota,
}: {
  nota?: {
    id: string;
    titulo: string;
    slug: string;
    resumen: string;
    cuerpo: string;
    imagenAlt: string;
    imagenUrl: string | null;
  };
}) {
  const [titulo, setTitulo] = useState(nota?.titulo ?? "");
  const [slug, setSlug] = useState(nota?.slug ?? "");
  const [slugTocado, setSlugTocado] = useState(Boolean(nota));
  const [cuerpo, setCuerpo] = useState(nota?.cuerpo ?? "");

  return (
    <FormAdmin action={guardarNota} boton={nota ? "Guardar" : "Crear nota"} className="space-y-5">
      {nota && <input type="hidden" name="id" value={nota.id} />}
      <Campo label="Título">
        <input
          name="titulo"
          required
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value);
            if (!slugTocado) setSlug(slugify(e.target.value));
          }}
          className="campo"
        />
      </Campo>
      <Campo label="Enlace" ayuda="Se arma solo con el título. Puedes cambiarlo.">
        <input
          name="slug"
          value={slug}
          onChange={(e) => {
            setSlugTocado(true);
            setSlug(slugify(e.target.value));
          }}
          className="campo"
        />
      </Campo>
      <Campo label="Resumen" ayuda="Una o dos frases. Se usa en la lista y al compartir la nota.">
        <textarea name="resumen" rows={2} maxLength={300} defaultValue={nota?.resumen} className="campo" />
      </Campo>
      <Campo label="Texto" ayuda={AYUDA_CUERPO}>
        <textarea name="cuerpo" rows={12} value={cuerpo} onChange={(e) => setCuerpo(e.target.value)} className="campo" />
      </Campo>
      <div className="border border-negro/10 bg-blanco p-4">
        <p className="etiqueta mb-3 text-negro/85">Vista previa</p>
        {cuerpo.trim() ? <CuerpoNota texto={cuerpo} /> : <p className="text-sm text-negro/70">El texto se ve aquí mientras lo escribes.</p>}
      </div>
      <Campo label="Texto de la foto" ayuda="Describe la imagen para quien no puede verla.">
        <input name="imagenAlt" defaultValue={nota?.imagenAlt} className="campo" />
      </Campo>
      <CampoFoto id={nota?.id ?? "nueva"} actual={nota?.imagenUrl} alt={nota?.titulo} proporcion="Horizontal 3:2" nota="foto de la nota" />
    </FormAdmin>
  );
}
