import { publicarResena, rechazarResena, responderResena, volverPendiente } from "@/lib/actions/resenas";
import type { AnchoPie, EstadoResena } from "@/db/schema";
import { ETIQUETA_ANCHO, OPCIONES_AJUSTE } from "@/lib/resenas-texto";
import { formatFecha } from "@/lib/formato";
import { FormAdmin } from "@/components/admin/form-admin";
import { Estrellas } from "@/components/resenas/estrellas";

export type ResenaAdmin = {
  id: string;
  nombre: string;
  ciudad: string | null;
  calificacion: number;
  titulo: string;
  texto: string;
  ajuste: number;
  anchoPie: AnchoPie;
  verificada: boolean;
  respuesta: string | null;
  createdAt: Date;
  productoNombre: string;
  slug: string;
};

/** Una reseña en el panel, con publicar, rechazar y la respuesta de la tienda. */
export function TarjetaResenaAdmin({ resena, estado }: { resena: ResenaAdmin; estado: EstadoResena }) {
  const ajuste = OPCIONES_AJUSTE.find((o) => o.valor === resena.ajuste)?.etiqueta;
  return (
    <article className="border border-negro/15 p-4 md:p-5">
      <p className="text-sm text-negro/70">{resena.productoNombre}</p>
      <div className="mt-2">
        <Estrellas valor={resena.calificacion} />
      </div>
      <h2 className="mt-2 text-lg font-medium">{resena.titulo}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{resena.texto}</p>
      <p className="mt-3 text-sm text-negro/75">
        {resena.nombre}
        {resena.ciudad ? ` · ${resena.ciudad}` : ""} · Pie {ETIQUETA_ANCHO[resena.anchoPie].toLocaleLowerCase("es-MX")}
        {ajuste ? ` · ${ajuste}` : ""}
        {resena.verificada ? " · Compra verificada" : " · Capturada a mano"}
      </p>
      <p className="mt-1 text-xs text-negro/60">{formatFecha(resena.createdAt)}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {estado !== "publicada" && (
          <form action={publicarResena}>
            <input type="hidden" name="id" value={resena.id} />
            <button type="submit" className="btn-primario">
              Publicar
            </button>
          </form>
        )}
        {estado !== "rechazada" && (
          <form action={rechazarResena}>
            <input type="hidden" name="id" value={resena.id} />
            <button type="submit" className="btn-contorno">
              Rechazar
            </button>
          </form>
        )}
        {estado !== "pendiente" && (
          <form action={volverPendiente}>
            <input type="hidden" name="id" value={resena.id} />
            <button type="submit" className="btn-contorno">
              Volver a pendiente
            </button>
          </form>
        )}
      </div>

      <FormAdmin action={responderResena} boton="Guardar respuesta" className="mt-5 max-w-xl">
        <input type="hidden" name="id" value={resena.id} />
        <label className="block">
          <span className="campo-label">Responder como la tienda</span>
          <textarea name="respuesta" rows={3} maxLength={2000} defaultValue={resena.respuesta ?? ""} className="campo" />
        </label>
      </FormAdmin>
    </article>
  );
}
