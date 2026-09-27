import type { Metadata } from "next";
import Link from "next/link";
import { marca } from "@/config/marca";
import { FotoPendiente } from "@/components/ui/foto";

export const metadata: Metadata = {
  title: "Nuestra historia",
  description: `El oficio detrás de cada par de ${marca.nombre}.`,
};

// Texto provisional: la historia real de la marca está pendiente (docs/08-decisiones-pendientes.md #5)
const PASOS = [
  { n: "01", titulo: "Patrón", texto: "Todo empieza en papel: el patrón define la forma y el ajuste de cada modelo." },
  { n: "02", titulo: "Corte", texto: "Elegimos cada piel y la cortamos a mano, aprovechando sus mejores zonas." },
  { n: "03", titulo: "Cosido", texto: "Las piezas se unen con costuras firmes y precisas, hechas para resistir." },
  { n: "04", titulo: "Montado", texto: "La piel se estira sobre la horma y toma su forma definitiva." },
  { n: "05", titulo: "Acabado", texto: "Suela, tinte y pulido final. Cada par se revisa antes de salir del taller." },
];

export default function NuestraHistoria() {
  return (
    <>
      <section className="textura bg-cafe py-24 text-center text-crema-claro md:py-32">
        <div className="contenedor aparecer max-w-3xl">
          <p className="etiqueta text-crema/75">Nuestra historia</p>
          <h1 className="titulo-display mt-4 text-5xl md:text-7xl">Un oficio que se hace sin prisa</h1>
          <p className="mt-8 text-lg text-crema/90">
            {marca.nombre} nace en {marca.fundada} con una idea sencilla: hacer calzado de piel que dure años y que se vea
            mejor con cada uno de ellos.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-2">
        <FotoPendiente tono="terracota" nota="retrato del taller o del fundador" sinIlustracion className="aspect-[4/3] md:aspect-auto md:min-h-[32rem]" />
        <div className="flex items-center px-6 py-16 md:px-16">
          <div className="prosa max-w-md">
            <h2 className="!mt-0">¿Quién es Don Simon?</h2>
            <p>
              Aquí va la historia del nombre y de la persona detrás de la marca: de dónde viene, qué la inspiró y por qué el
              calzado hecho a mano.
            </p>
            <p>
              Es el espacio para contar lo que hace diferente a cada par: la piel que se elige, el taller donde se trabaja y las
              manos que lo hacen.
            </p>
          </div>
        </div>
      </section>

      <section className="contenedor py-20 md:py-28" aria-labelledby="titulo-proceso">
        <h2 id="titulo-proceso" className="titulo-display text-center text-4xl md:text-5xl">
          Paso a paso
        </h2>
        <ol className="mt-14 grid gap-10 md:grid-cols-5 md:gap-6">
          {PASOS.map((p) => (
            <li key={p.n} className="border-t border-cafe/25 pt-5">
              <span className="etiqueta text-terracota-oscuro">{p.n}</span>
              <h3 className="titulo-display mt-2 text-3xl">{p.titulo}</h3>
              <p className="mt-3 text-[0.9375rem]">{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-2 px-2 pb-2 sm:grid-cols-3">
        <FotoPendiente tono="olivo" nota="herramientas: lezna, tijeras, hilo" sinIlustracion className="aspect-square" />
        <FotoPendiente tono="cafe" nota="piel con el logo grabado" sinIlustracion className="aspect-square" />
        <FotoPendiente tono="claro" nota="par terminado sobre madera" className="aspect-square" />
      </section>

      <section className="py-20 text-center md:py-28">
        <h2 className="titulo-display text-4xl md:text-5xl">Encuentra tu par</h2>
        <Link href="/coleccion" className="btn-primario mt-8">
          Ver colección
        </Link>
      </section>
    </>
  );
}
