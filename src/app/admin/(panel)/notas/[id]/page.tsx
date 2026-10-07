import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getNota } from "@/lib/data/notas";
import { borrarNota, publicarNota, volverBorrador } from "@/lib/actions/notas";
import { BotonQuitar } from "@/components/admin/boton-quitar";
import { FormNota } from "@/components/admin/form-nota";
import { TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Editar nota" };

export default async function EditarNota({ params }: PageProps<"/admin/notas/[id]">) {
  const nota = await getNota((await params).id);
  if (!nota) notFound();

  return (
    <>
      <TituloAdmin
        accion={
          nota.estado === "publicada" ? (
            <Link href={`/notas/${nota.slug}`} target="_blank" className="btn-contorno">
              Ver nota ↗
            </Link>
          ) : (
            <span className="text-sm text-cafe/80">Borrador: no se ve en la tienda</span>
          )
        }
      >
        {nota.titulo}
      </TituloAdmin>
      <div className="mb-6 flex flex-wrap gap-3">
        <form action={nota.estado === "publicada" ? volverBorrador : publicarNota}>
          <input type="hidden" name="id" value={nota.id} />
          <button type="submit" className="btn-contorno">
            {nota.estado === "publicada" ? "Volver a borrador" : "Publicar"}
          </button>
        </form>
        <BotonQuitar action={borrarNota} id={nota.id} pregunta="¿Quitas esta nota?" texto="Quitar nota" />
      </div>
      <div className="max-w-3xl">
        <FormNota nota={nota} />
      </div>
    </>
  );
}
