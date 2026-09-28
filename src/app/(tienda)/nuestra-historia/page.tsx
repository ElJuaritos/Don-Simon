import type { Metadata } from "next";
import Link from "next/link";
import { marca } from "@/config/marca";
import { getBloques } from "@/lib/data/contenido";
import { EditorialDividido } from "@/components/portada/editorial-dividido";
import { Galeria } from "@/components/portada/galeria";
import { Foto } from "@/components/ui/foto";

export const metadata: Metadata = {
  title: "Nuestra historia",
  description: `El oficio detrás de cada par de ${marca.nombre}.`,
};

// Fotos y textos editables en /admin/contenido?grupo=historia.
// La historia real está pendiente (docs/08-decisiones-pendientes.md #5).

const PASOS = [
  { n: "01", titulo: "Patrón", texto: "Todo empieza en papel: el patrón define la forma y el ajuste de cada modelo." },
  { n: "02", titulo: "Corte", texto: "Elegimos cada piel y la cortamos a mano, aprovechando sus mejores zonas." },
  { n: "03", titulo: "Cosido", texto: "Las piezas se unen con costuras firmes y precisas, hechas para resistir." },
  { n: "04", titulo: "Montado", texto: "La piel se estira sobre la horma y toma su forma definitiva." },
  { n: "05", titulo: "Acabado", texto: "Suela, tinte y pulido final. Cada par se revisa antes de salir del taller." },
];

export default async function NuestraHistoria() {
  const b = await getBloques("historia");
  const intro = b["historia-intro"];

  return (
    <>
      <section className="contenedor aparecer pt-16 pb-12 text-center md:pt-28 md:pb-16">
        <p className="etiqueta text-cafe/85">Nuestra historia</p>
        <h1 className="titulo-display mx-auto mt-5 max-w-4xl text-5xl md:text-7xl">{intro.titulo}</h1>
        {intro.texto && <p className="mx-auto mt-8 max-w-xl text-lg">{intro.texto}</p>}
      </section>

      <div className="contenedor">
        <Foto
          imagen={intro.imagen}
          tono="piedra"
          nota={intro.notaFoto}
          sinIlustracion
          sizes="100vw"
          prioridad
          className="aspect-[4/5] sm:aspect-[16/9]"
        />
      </div>

      <div className="py-12 md:py-20">
        <EditorialDividido bloque={b["historia-quien"]} etiqueta="La casa" />
      </div>

      <section className="border-y border-cafe/10 bg-arena/50" aria-labelledby="titulo-proceso">
        <div className="contenedor seccion">
          <h2 id="titulo-proceso" className="titulo-display text-center text-4xl md:text-5xl">
            Paso a paso
          </h2>
          <ol className="mt-16 grid gap-10 md:grid-cols-5 md:gap-8">
            {PASOS.map((p) => (
              <li key={p.n} className="revelar border-t border-cafe/25 pt-5">
                <span className="etiqueta text-cafe/85">{p.n}</span>
                <h3 className="titulo-display mt-2 text-3xl">{p.titulo}</h3>
                <p className="mt-3 text-[0.9375rem]">{p.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="py-8 md:py-12">
        <Galeria fotos={[b["historia-galeria-1"], b["historia-galeria-2"], b["historia-galeria-3"]]} titulo="El taller" />
      </div>

      <section className="seccion text-center">
        <h2 className="titulo-display text-4xl md:text-5xl">Encuentra tu par</h2>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/coleccion?para=hombre" className="btn-primario min-w-44">
            Hombre
          </Link>
          <Link href="/coleccion?para=mujer" className="btn-contorno min-w-44">
            Mujer
          </Link>
        </div>
      </section>
    </>
  );
}
