import type { Metadata } from "next";
import Link from "next/link";
import { getNotasAdmin } from "@/lib/data/notas";
import { publicarNota, volverBorrador } from "@/lib/actions/notas";
import { formatDia } from "@/lib/formato";
import { Tarjeta, TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Notas" };

export default async function NotasAdmin() {
  const lista = await getNotasAdmin();
  return (
    <>
      <TituloAdmin
        accion={
          <Link href="/admin/notas/nueva" className="btn-primario">
            Nueva nota
          </Link>
        }
      >
        Notas
      </TituloAdmin>
      <p className="mb-8 max-w-2xl text-cafe/85">
        Una nota en borrador no se ve en la tienda. Al publicarla por primera vez se guarda la fecha.
      </p>
      {lista.length === 0 ? (
        <p className="text-cafe/85">Todavía no hay notas.</p>
      ) : (
        <ul className="grid max-w-3xl gap-4">
          {lista.map((n) => (
            <li key={n.id}>
              <Tarjeta className="bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link href={`/admin/notas/${n.id}`} className="text-lg font-semibold hover:opacity-70">
                      {n.titulo}
                    </Link>
                    <p className="mt-1 text-sm text-cafe/80">
                      {n.estado === "publicada" ? "Publicada" : "Borrador"}
                      {" · "}
                      {formatDia(n.publicadaEn ?? n.updatedAt)}
                    </p>
                  </div>
                  <form action={n.estado === "publicada" ? volverBorrador : publicarNota}>
                    <input type="hidden" name="id" value={n.id} />
                    <button type="submit" className="btn-contorno">
                      {n.estado === "publicada" ? "Volver a borrador" : "Publicar"}
                    </button>
                  </form>
                </div>
              </Tarjeta>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
