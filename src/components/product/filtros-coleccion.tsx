import Link from "next/link";
import type { Orden } from "@/lib/data/catalogo";
import { formatTalla } from "@/lib/formato";

// Filtros de talla, color y orden. Es un formulario GET: funciona sin JavaScript
// y los filtros quedan en la URL para poder compartirlos.

export const ORDENES: { valor: Orden; texto: string }[] = [
  { valor: "destacados", texto: "Destacados" },
  { valor: "novedades", texto: "Novedades" },
  { valor: "precio-asc", texto: "Precio: menor a mayor" },
  { valor: "precio-desc", texto: "Precio: mayor a menor" },
];

export function FormFiltros({
  rutaBase,
  para,
  talla,
  color,
  orden,
  opciones,
  total,
  limpiarHref,
}: {
  rutaBase: string;
  para?: string;
  talla?: string;
  color?: string;
  orden: Orden;
  opciones: { tallas: number[]; colores: string[] };
  total: number;
  limpiarHref: string;
}) {
  const hayFiltros = Boolean(talla || color);
  return (
    <form method="get" action={rutaBase} className="flex flex-wrap items-end gap-3 border-y border-cafe/10 py-4">
      {para && <input type="hidden" name="para" value={para} />}
      <Selector id="f-talla" nombre="talla" etiqueta="Talla (MX)" valor={talla} ancho="min-w-28">
        <option value="">Todas</option>
        {opciones.tallas.map((t) => (
          <option key={t} value={t}>
            {formatTalla(t)}
          </option>
        ))}
      </Selector>
      <Selector id="f-color" nombre="color" etiqueta="Color" valor={color} ancho="min-w-32">
        <option value="">Todos</option>
        {opciones.colores.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </Selector>
      <Selector id="f-orden" nombre="orden" etiqueta="Ordenar" valor={orden} ancho="min-w-48">
        {ORDENES.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </Selector>
      <button type="submit" className="btn-primario min-h-11 px-5">
        Aplicar
      </button>
      {hayFiltros && (
        <Link href={limpiarHref} className="enlace ml-1 self-center text-sm">
          Quitar filtros
        </Link>
      )}
      <p className="ml-auto self-center text-sm text-cafe/85">
        {total} {total === 1 ? "modelo" : "modelos"}
      </p>
    </form>
  );
}

function Selector({
  id,
  nombre,
  etiqueta,
  valor,
  ancho,
  children,
}: {
  id: string;
  nombre: string;
  etiqueta: string;
  valor?: string;
  ancho: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="campo-label text-xs">
        {etiqueta}
      </label>
      <select id={id} name={nombre} defaultValue={valor ?? ""} className={`campo py-2 ${ancho}`}>
        {children}
      </select>
    </div>
  );
}
