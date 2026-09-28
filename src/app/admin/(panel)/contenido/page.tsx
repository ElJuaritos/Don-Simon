import type { Metadata } from "next";
import Link from "next/link";
import { inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { bloques } from "@/db/schema";
import { BLOQUES, GRUPOS, type GrupoBloque } from "@/content/bloques";
import { getBloques } from "@/lib/data/contenido";
import { FormBloque } from "@/components/admin/form-bloque";
import { TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Portada y textos" };

// Editor de los cuadros (foto + textos) de la portada y de Nuestra historia.

export default async function ContenidoAdmin({ searchParams }: PageProps<"/admin/contenido">) {
  const { grupo: g } = await searchParams;
  const grupo: GrupoBloque = g === "historia" ? "historia" : "portada";
  const defs = BLOQUES.filter((b) => b.grupo === grupo);

  const db = await getDb();
  const [resueltos, guardados] = await Promise.all([
    getBloques(grupo),
    db.select({ clave: bloques.clave }).from(bloques).where(inArray(bloques.clave, defs.map((d) => d.clave))),
  ]);

  return (
    <>
      <TituloAdmin
        accion={
          <Link href={GRUPOS[grupo].ruta} target="_blank" className="btn-contorno">
            Ver página ↗
          </Link>
        }
      >
        Portada y textos
      </TituloAdmin>

      <nav aria-label="Página a editar" className="mb-6 flex gap-2">
        {(Object.keys(GRUPOS) as GrupoBloque[]).map((clave) => (
          <Link
            key={clave}
            href={`/admin/contenido?grupo=${clave}`}
            aria-current={clave === grupo ? "page" : undefined}
            className={`etiqueta border px-4 py-2.5 ${clave === grupo ? "border-cafe bg-cafe text-crema-claro" : "border-cafe/25 hover:border-cafe"}`}
          >
            {GRUPOS[clave].nombre}
          </Link>
        ))}
      </nav>

      <p className="mb-8 max-w-2xl text-cafe/85">
        Cada cuadro es un espacio de la página. Sube la foto, ajusta los textos y presiona <strong>Guardar</strong>. Los
        cuadros están en el mismo orden en que aparecen en la tienda.
      </p>

      <div className="grid max-w-3xl gap-6">
        {defs.map((def) => (
          <FormBloque
            key={def.clave}
            def={def}
            bloque={resueltos[def.clave]}
            personalizado={guardados.some((f) => f.clave === def.clave)}
          />
        ))}
      </div>
    </>
  );
}
