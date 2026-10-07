import type { Metadata } from "next";
import Link from "next/link";
import { getHormas } from "@/lib/data/contenido";
import { FichaLateral } from "@/components/tienda/ficha-lateral";

export const metadata: Metadata = {
  title: "Nuestras hormas",
  description: "La horma define cómo te queda un zapato. Conoce en qué horma está hecho cada modelo y qué talla pedir.",
};

// Hormas editables en /admin/hormas. El formato es el mismo de /pieles.

export default async function NuestrasHormas() {
  const hormas = await getHormas();

  return (
    <>
      <section className="contenedor aparecer pt-16 pb-12 text-center md:pt-24 md:pb-20">
        <p className="etiqueta text-cafe/85">Ajuste</p>
        <h1 className="titulo-display mx-auto mt-5 max-w-3xl text-5xl md:text-7xl">Nuestras hormas</h1>
        <p className="mx-auto mt-8 max-w-xl text-lg">
          La horma es el molde de madera sobre el que se monta cada zapato. De ella dependen la forma de la punta, la
          altura del empeine y cómo te sujeta el talón. Cada modelo te dice en qué horma está hecho.
        </p>
      </section>

      <div className="contenedor space-y-16 pb-16 md:space-y-20 md:pb-24">
        {hormas.map((h, i) => (
          <FichaLateral
            key={h.id}
            id={`horma-${h.id}`}
            etiqueta={String(i + 1).padStart(2, "0")}
            titulo={h.nombre}
            texto={h.descripcion}
            imagen={h.imagenUrl ? { url: h.imagenUrl, alt: h.nombre } : null}
            notaFoto={`${h.nombre.toLowerCase()} en el taller`}
            invertido={i % 2 === 1}
            extra={
              <dl className="mt-8 divide-y divide-cafe/10 border-y border-cafe/10 text-[0.9375rem]">
                <div className="flex justify-between gap-6 py-3">
                  <dt className="font-semibold">Ancho</dt>
                  <dd>{h.ancho === "ancho" ? "Amplio" : "Estándar"}</dd>
                </div>
                <div className="flex justify-between gap-6 py-3">
                  <dt className="font-semibold">Talla</dt>
                  <dd className="text-right">{h.recomendacion}</dd>
                </div>
              </dl>
            }
          />
        ))}
      </div>

      <section className="border-t border-cafe/10 bg-arena/50">
        <div className="contenedor seccion text-center">
          <h2 className="titulo-display text-4xl md:text-5xl">¿Dudas con tu talla?</h2>
          <p className="mx-auto mt-6 max-w-md">Mide tu pie en casa con nuestra guía o escríbenos y te ayudamos a elegir.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/ayuda/guia-de-tallas" className="btn-primario min-w-52">
              Guía de tallas
            </Link>
            <Link href="/contacto" className="btn-contorno min-w-52">
              Escríbenos
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
