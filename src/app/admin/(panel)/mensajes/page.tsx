import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { mensajes, suscriptores } from "@/db/schema";
import { marcarLeido } from "@/lib/actions/admin";
import { formatFecha } from "@/lib/formato";
import { Tarjeta, TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Mensajes" };

export default async function MensajesAdmin() {
  const db = await getDb();
  const [lista, subs] = await Promise.all([
    db.select().from(mensajes).orderBy(desc(mensajes.createdAt)).limit(100),
    db.select().from(suscriptores).orderBy(desc(suscriptores.createdAt)).limit(500),
  ]);

  return (
    <>
      <TituloAdmin>Mensajes</TituloAdmin>
      <div className="grid max-w-6xl gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Tarjeta titulo="Formulario de contacto">
          {lista.length === 0 ? (
            <p className="text-cafe/85">Sin mensajes por ahora.</p>
          ) : (
            <ul className="space-y-4">
              {lista.map((m) => (
                <li key={m.id} className={`border p-4 ${m.leido ? "border-cafe/10" : "border-cafe/40 bg-crema-claro"}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">
                      {!m.leido && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-terracota" aria-label="Sin leer" />}
                      {m.nombre}
                    </p>
                    <p className="text-sm text-cafe/85">{formatFecha(m.createdAt)}</p>
                  </div>
                  <p className="text-sm">
                    <a href={`mailto:${m.email}`} className="enlace">{m.email}</a>
                    {m.telefono && <> · {m.telefono}</>}
                  </p>
                  <p className="mt-3 whitespace-pre-line">{m.mensaje}</p>
                  {!m.leido && (
                    <form action={marcarLeido} className="mt-3">
                      <input type="hidden" name="id" value={m.id} />
                      <button type="submit" className="enlace text-sm">Marcar como leído</button>
                    </form>
                  )}
                </li>
              ))}
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
                  <span className="shrink-0 text-cafe/85">{s.origen}</span>
                </li>
              ))}
            </ul>
          )}
        </Tarjeta>
      </div>
    </>
  );
}
