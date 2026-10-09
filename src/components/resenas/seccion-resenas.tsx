import type { ResumenResenas, ResenaPublica } from "@/lib/data/resenas";
import { ListaResenas } from "./lista-resenas";
import { ResumenResenasVista } from "./resumen-resenas";

/** Bloque de reseñas de una ficha. Solo se monta si ya se pueden mostrar. */
export function SeccionResenas({ resumen, resenas }: { resumen: ResumenResenas; resenas: ResenaPublica[] }) {
  return (
    <section id="resenas" aria-labelledby="titulo-resenas" className="border-t border-negro/10 py-14 md:py-20">
      <div className="contenedor">
        <h2 id="titulo-resenas" className="titulo-display text-4xl">
          Reseñas
        </h2>
        <div className="mt-8">
          <ResumenResenasVista resumen={resumen} />
        </div>
        <div className="mt-10">
          <ListaResenas resenas={resenas} buscar ancho />
        </div>
      </div>
    </section>
  );
}
