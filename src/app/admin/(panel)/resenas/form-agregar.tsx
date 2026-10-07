import { agregarResenaManual } from "@/lib/actions/resenas";
import { ANCHOS_PIE, type AnchoPie } from "@/db/schema";
import { ETIQUETA_ANCHO, OPCIONES_AJUSTE } from "@/lib/resenas-texto";
import { FormAdmin } from "@/components/admin/form-admin";
import { SelectorEstrellas } from "@/components/resenas/selector-estrellas";

/** Captura una reseña que llegó por WhatsApp o en persona. Entra como pendiente. */
export function FormAgregarResena({ productos }: { productos: { id: string; nombre: string }[] }) {
  return (
    <FormAdmin action={agregarResenaManual} boton="Guardar reseña" className="grid max-w-xl gap-4">
      <label className="block">
        <span className="campo-label">Producto</span>
        <select name="productoId" required className="campo" defaultValue="">
          <option value="" disabled>
            Elige un modelo
          </option>
          {productos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>
      </label>
      <SelectorEstrellas />
      <label className="block">
        <span className="campo-label">Título</span>
        <input name="titulo" required minLength={2} maxLength={120} className="campo" />
      </label>
      <label className="block">
        <span className="campo-label">Texto</span>
        <textarea name="texto" required minLength={20} maxLength={2000} rows={4} className="campo" />
      </label>
      <label className="block">
        <span className="campo-label">¿Cómo le quedó?</span>
        <select name="ajuste" required className="campo" defaultValue="0">
          {OPCIONES_AJUSTE.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.etiqueta}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="campo-label">Ancho de pie</span>
        <select name="anchoPie" required className="campo" defaultValue="normal">
          {ANCHOS_PIE.map((a) => (
            <option key={a} value={a}>
              {ETIQUETA_ANCHO[a as AnchoPie]}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="campo-label">Nombre que se muestra</span>
        <input name="nombre" required minLength={2} maxLength={80} className="campo" placeholder="Ana L." />
      </label>
      <label className="block">
        <span className="campo-label">Ciudad (opcional)</span>
        <input name="ciudad" maxLength={80} className="campo" />
      </label>
    </FormAdmin>
  );
}
