import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { mensajes, pedidos, suscriptores, type TipoMensaje } from "@/db/schema";
import { marcarLeido } from "@/lib/actions/admin";
import { formatFecha, numeroDeFolio } from "@/lib/formato";
import { Tarjeta, TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Mensajes" };

const FILTROS: { valor: "" | TipoMensaje; texto: string }[] = [
  { valor: "", texto: "Todos" },
  { valor: "contacto", texto: "Preguntas" },
  { valor: "sugerencia", texto: "Sugerencias" },
  { valor: "devolucion", texto: "Cambios y devoluciones" },
];

const ETIQUETA: Record<TipoMensaje, string> = {
  contacto: "Pregunta",
  sugerencia: "Sugerencia",
  devolucion: "Cambio o devolución",
};

function folioDe(mensaje: string) {
  const m = mensaje.match(/Folio:\s*(DS-\d+)/i);
  return m?.[1] ?? null;
}

export default async function MensajesAdmin({ searchParams }: PageProps<"/admin/mensajes">) {
  const tipo = (await searchParams).tipo;
  const filtro = tipo === "contacto" || tipo === "sugerencia" || tipo === "devolucion" ? tipo : "";
  const db = await getDb();
  const [lista, subs] = await Promise.all([
    filtro
      ? db.select().from(mensajes).where(eq(mensajes.tipo, filtro)).orderBy(desc(mensajes.createdAt)).limit(100)
      : db.select().from(mensajes).orderBy(desc(mensajes.createdAt)).limit(100),
    db.select().from(suscriptores).orderBy(desc(suscriptores.createdAt)).limit(500),
  ]);

  const numeros = [...new Set(lista.map((m) => folioDe(m.mensaje)).map((f) => (f ? numeroDeFolio(f) : null)).filter((n): n is number => n != null))];
  const ligados = numeros.length
    ? await db.select({ id: pedidos.id, numero: pedidos.numero }).from(pedidos).where(inArray(pedidos.numero, numeros))
    : [];
  const pedidoPorNumero = new Map(ligados.map((p) => [p.numero, p.id]));

  return (
    <>
      <TituloAdmin>Mensajes</TituloAdmin>
      <nav aria-label="Filtrar por tipo" className="mb-6 flex gap-2 overflow-x-auto">
        {FILTROS.map((f) => (
          <Link
            key={f.valor || "todos"}
            href={f.valor ? `/admin/mensajes?tipo=${f.valor}` : "/admin/mensajes"}
            aria-current={filtro === f.valor ? "page" : undefined}
            className={`whitespace-nowrap px-3 py-2 text-sm ${filtro === f.valor ? "bg-cafe text-crema-claro" : "border border-cafe/20"}`}
          >
            {f.texto}
          </Link>
        ))}
      </nav>
      <div className="grid max-w-6xl gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Tarjeta titulo="Bandeja">
          {lista.length === 0 ? (
            <p className="text-cafe/85">Sin mensajes por ahora.</p>
          ) : (
            <ul className="space-y-4">
              {lista.map((m) => {
                const folio = folioDe(m.mensaje);
                const numero = folio ? numeroDeFolio(folio) : null;
                const pedidoId = numero != null ? pedidoPorNumero.get(numero) : undefined;
                return (
                  <li key={m.id} className={`border p-4 ${m.leido ? "border-cafe/10" : "border-cafe/40 bg-crema-claro"}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-semibold">
                        {!m.leido && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-terracota" aria-label="Sin leer" />}
                        {m.nombre}
                      </p>
                      <p className="text-sm text-cafe/85">{formatFecha(m.createdAt)}</p>
                    </div>
                    <p className="mt-1">
                      <span className="etiqueta text-cafe/80">{ETIQUETA[m.tipo]}</span>
                    </p>
                    <p className="text-sm">
                      <a href={`mailto:${m.email}`} className="enlace">
                        {m.email}
                      </a>
                      {m.telefono && <> · {m.telefono}</>}
                    </p>
                    <p className="mt-3 whitespace-pre-line">
                      {m.mensaje.split("\n").map((linea, i) => {
                        const esFolio = /^Folio:\s*DS-\d+$/i.test(linea) && pedidoId;
                        return (
                          <span key={i}>
                            {i > 0 && "\n"}
                            {esFolio ? (
                              <>
                                Folio:{" "}
                                <Link href={`/admin/pedidos/${pedidoId}`} className="enlace">
                                  {folio}
                                </Link>
                              </>
                            ) : (
                              linea
                            )}
                          </span>
                        );
                      })}
                    </p>
                    {!m.leido && (
                      <form action={marcarLeido} className="mt-3">
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="enlace text-sm">
                          Marcar como leído
                        </button>
                      </form>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Tarjeta>
        <Tarjeta titulo={`Newsletter (${subs.length})`}>
          {subs.length === 0 ? (
            <p className="text-cafe/85">Aún no hay suscriptores.</p>
          ) : (
            <ul className="max-h-[32rem] space-y-1 overflow-y-auto text-sm">
              {subs.map((s) => (
                <li key={s.id} className="flex justify-between gap-2">
                  <span className="truncate">{s.email}</span>
                  <span className="shrink-0 text-cafe/85">
                    {s.preferencia === "hombre" ? "Hombre" : s.preferencia === "mujer" ? "Mujer" : "Ambos"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>
    </>
  );
}
