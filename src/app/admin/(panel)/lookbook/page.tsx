import type { Metadata } from "next";
import Link from "next/link";
import { inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { bloques } from "@/db/schema";
import { BLOQUES } from "@/content/bloques";
import { FormBloque } from "@/components/admin/form-bloque";
import { FormLookbook } from "@/components/admin/form-lookbook";
import { Tarjeta, TituloAdmin } from "@/components/admin/ui";
import { getBloques } from "@/lib/data/contenido";
import { getLookbookAdmin, getProductosParaEnlace } from "@/lib/data/lookbook";

export const metadata: Metadata = { title: "Lookbook" };

const PUBLICO = { hombre: "Hombre", mujer: "Mujer", unisex: "Ambos" } as const;

export default async function LookbookAdmin() {
  const defs = BLOQUES.filter((b) => b.grupo === "lookbook");
  const db = await getDb();
  const [resueltos, guardados, lista, productos] = await Promise.all([
    getBloques("lookbook"),
    db.select({ clave: bloques.clave }).from(bloques).where(inArray(bloques.clave, defs.map((d) => d.clave))),
    getLookbookAdmin(),
    getProductosParaEnlace(),
  ]);
  const ordenSiguiente = (lista.at(-1)?.foto.orden ?? 0) + 1;

  return (
    <>
      <TituloAdmin
        accion={
          <Link href="/lookbook" target="_blank" className="btn-contorno">
            Ver página ↗
          </Link>
        }
      >
        Lookbook
      </TituloAdmin>
      <p className="mb-8 max-w-2xl text-cafe/85">
        Sube las fotos de la temporada, ordénalas y, si en la foto sale un modelo de la tienda, enlázalo. El 1 aparece
        primero. En el celular se ve una foto por pantalla.
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

        <Tarjeta titulo="Agregar foto" className="bg-white">
          <FormLookbook productos={productos} ordenSiguiente={ordenSiguiente} />
        </Tarjeta>

        {lista.map(({ foto, productoNombre }) => (
          <Tarjeta key={foto.id} titulo={foto.alt || "Foto sin descripción"} className="bg-white">
            <p className="mb-4 text-sm text-cafe/85">
              {PUBLICO[foto.publico]}
              {productoNombre ? ` · ${productoNombre}` : ""}
              {foto.activa ? "" : " · Oculta"}
            </p>
            <FormLookbook foto={foto} productos={productos} />
          </Tarjeta>
        ))}
      </div>
    </>
  );
}
