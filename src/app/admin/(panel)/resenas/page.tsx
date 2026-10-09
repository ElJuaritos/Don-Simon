import type { Metadata } from "next";
import Link from "next/link";
import { estadoResenaValido } from "@/lib/resenas-texto";
import { contarPorEstado, listarParaAdmin, productosParaResena } from "@/lib/data/resenas";
import { TituloAdmin } from "@/components/admin/ui";
import { FormAgregarResena } from "./form-agregar";
import { TarjetaResenaAdmin } from "./tarjeta-resena";

export const metadata: Metadata = { title: "Reseñas" };

const TABS = [
  { id: "pendiente", texto: "Pendientes" },
  { id: "publicada", texto: "Publicadas" },
  { id: "rechazada", texto: "Rechazadas" },
] as const;

export default async function AdminResenas({ searchParams }: PageProps<"/admin/resenas">) {
  const sp = await searchParams;
  const estado = estadoResenaValido(typeof sp.estado === "string" ? sp.estado : undefined);
  const [conteo, lista, productos] = await Promise.all([contarPorEstado(), listarParaAdmin(estado), productosParaResena()]);

  return (
    <>
      <TituloAdmin>Reseñas</TituloAdmin>
      <p className="mb-6 max-w-2xl text-sm text-negro/80">
        Nada se publica solo. Revisa cada reseña y publícala cuando te parezca bien.
      </p>

      <div className="flex gap-2 overflow-x-auto">
        {TABS.map((t) => {
          const activa = t.id === estado;
          return (
            <Link
              key={t.id}
              href={t.id === "pendiente" ? "/admin/resenas" : `/admin/resenas?estado=${t.id}`}
              aria-current={activa ? "page" : undefined}
              className={`whitespace-nowrap px-4 py-3 text-sm font-semibold ${activa ? "bg-negro text-blanco" : "border border-negro/15"}`}
            >
              {t.texto} ({conteo[t.id]})
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid max-w-3xl gap-4">
        {lista.length === 0 ? (
          <p className="text-sm text-negro/75">No hay reseñas en esta lista.</p>
        ) : (
          lista.map((r) => <TarjetaResenaAdmin key={r.id} resena={r} estado={estado} />)
        )}
      </div>

      <section className="mt-12 max-w-xl border border-negro/15 p-5">
        <h2 className="text-lg font-medium">Agregar reseña</h2>
        <p className="mt-2 mb-5 text-sm text-negro/75">
          Para las que te lleguen por WhatsApp o en persona. No se marca como compra verificada y queda pendiente.
        </p>
        <FormAgregarResena productos={productos} />
      </section>
    </>
  );
}
