import type { ResumenResenas } from "@/lib/data/resenas";
import { formatPromedio, posicionAjuste, textoAjuste } from "@/lib/resenas-texto";
import { Estrellas } from "./estrellas";

/** Promedio, barras 5→1 e indicador de ajuste. */
export function ResumenResenasVista({ resumen }: { resumen: ResumenResenas }) {
  const frase = textoAjuste(resumen.ajuste);
  return (
    <div className="grid gap-8 border border-negro/10 bg-niebla/40 p-5 sm:p-6 lg:grid-cols-[auto_1fr_16rem] lg:items-center lg:gap-10">
      <div>
        <p className="font-sans text-5xl leading-none text-negro">{formatPromedio(resumen.promedio)}</p>
        <div className="mt-3">
          <Estrellas valor={resumen.promedio} />
        </div>
        <p className="mt-2 text-sm text-negro/75">
          Basado en {resumen.total} {resumen.total === 1 ? "reseña" : "reseñas"}
        </p>
      </div>

      <ul className="space-y-2">
        {resumen.distribucion.map((d) => {
          const pct = resumen.total ? (d.cantidad / resumen.total) * 100 : 0;
          return (
            <li key={d.estrellas} className="grid grid-cols-[1.5rem_1fr_2rem] items-center gap-3 text-sm">
              <span>{d.estrellas}</span>
              <span className="h-2 bg-topo" role="img" aria-label={`${d.cantidad} de ${d.estrellas} estrellas`}>
                <span className="block h-full bg-negro" style={{ width: `${pct}%` }} />
              </span>
              <span className="text-right text-negro/70">{d.cantidad}</span>
            </li>
          );
        })}
      </ul>

      <div>
        <p className="text-sm font-medium">Ajuste</p>
        <div className="mt-3 flex justify-between text-xs text-negro/70">
          <span>Chico</span>
          <span>Grande</span>
        </div>
        <div className="relative mt-2 h-1 bg-topo" role="img" aria-label={frase}>
          <span
            className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-negro"
            style={{ left: `${posicionAjuste(resumen.ajuste)}%` }}
          />
        </div>
        <p className="mt-3 text-sm">{frase}</p>
      </div>
    </div>
  );
}
