import type { Metadata } from "next";
import { marca } from "@/config/marca";
import { getPielesActivas } from "@/lib/data/pieles";
import { FichaLateral } from "@/components/tienda/ficha-lateral";
import { IndiceAnclas } from "@/components/tienda/indice-anclas";

export const metadata: Metadata = {
  title: "Pieles",
  description: `Las pieles con las que trabaja ${marca.nombre}, y cómo cuidarlas.`,
};

export default async function Pieles() {
  const lista = await getPielesActivas();

  return (
    <>
      <section className="contenedor aparecer pt-16 pb-12 text-center md:pt-24 md:pb-16">
        <p className="etiqueta text-negro/85">Materiales</p>
        <h1 className="titulo-display mx-auto mt-5 max-w-3xl text-5xl md:text-7xl">Pieles</h1>
        <p className="mx-auto mt-8 max-w-xl text-lg">
          Cada piel se comporta distinto. Aquí ves cómo se siente y cómo cuidarla.
        </p>
      </section>

      {lista.length > 3 && (
        <IndiceAnclas enlaces={lista.map((p) => ({ href: `#${p.slug}`, texto: p.nombre }))} />
      )}

      <div className="contenedor space-y-16 py-12 md:space-y-20 md:py-20">
        {lista.length === 0 && <p className="text-center">Pronto vas a conocer las pieles con las que trabajamos.</p>}
        {lista.map((p, i) => (
          <FichaLateral
            key={p.id}
            id={p.slug}
            etiqueta={String(i + 1).padStart(2, "0")}
            titulo={p.nombre}
            texto={p.descripcion}
            imagen={p.imagenUrl ? { url: p.imagenUrl, alt: p.nombre } : null}
            notaFoto={`${p.nombre.toLowerCase()} de cerca`}
            invertido={i % 2 === 1}
            extra={
              p.cuidado ? (
                <div className="mt-8 border-t border-negro/10 pt-6">
                  <h3 className="text-lg font-medium">Cómo cuidarla</h3>
                  <p className="mt-3 whitespace-pre-line">{p.cuidado}</p>
                </div>
              ) : null
            }
          />
        ))}
      </div>
    </>
  );
}
