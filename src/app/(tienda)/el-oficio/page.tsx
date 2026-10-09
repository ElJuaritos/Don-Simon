import type { Metadata } from "next";
import Link from "next/link";
import { marca } from "@/config/marca";
import { getBloques } from "@/lib/data/contenido";
import { EditorialDividido } from "@/components/portada/editorial-dividido";
import { Galeria } from "@/components/portada/galeria";
import { Foto } from "@/components/ui/foto";

export const metadata: Metadata = {
  title: "El oficio",
  description: `Cómo se hace un par de ${marca.nombre}: del patrón al acabado.`,
};

const PASOS = ["oficio-paso-1", "oficio-paso-2", "oficio-paso-3", "oficio-paso-4", "oficio-paso-5"] as const;
const CONSTRUCCIONES = ["oficio-construccion-1", "oficio-construccion-2", "oficio-construccion-3"] as const;

export default async function ElOficio() {
  const b = await getBloques("oficio");
  const intro = b["oficio-intro"];
  const pasos = PASOS.map((clave, i) => ({ bloque: b[clave], n: String(i + 1).padStart(2, "0") })).filter((p) => p.bloque?.titulo);
  const construcciones = CONSTRUCCIONES.map((clave) => b[clave]).filter((c) => c?.titulo);

  return (
    <>
      <section className="contenedor aparecer pt-16 pb-12 text-center md:pt-24 md:pb-16">
        <p className="etiqueta text-negro/85">El oficio</p>
        <h1 className="titulo-display mx-auto mt-5 max-w-4xl text-5xl md:text-7xl">{intro.titulo}</h1>
        {intro.texto && <p className="mx-auto mt-8 max-w-xl text-lg">{intro.texto}</p>}
      </section>

      <div className="contenedor">
        <Foto
          imagen={intro.imagen}
          tono="topo"
          nota={intro.notaFoto}
          sinIlustracion
          sizes="100vw"
          prioridad
          className="aspect-[4/5] sm:aspect-[16/9]"
        />
      </div>

      <div className="py-8 md:py-12">
        {pasos.map((p, i) => (
          <EditorialDividido key={p.bloque.clave} bloque={p.bloque} etiqueta={p.n} invertido={i % 2 === 1} />
        ))}
      </div>

      {construcciones.length > 0 && (
        <section className="border-y border-negro/10 bg-niebla/50" aria-labelledby="titulo-construccion">
          <div className="contenedor py-12 md:py-16">
            <h2 id="titulo-construccion" className="titulo-display text-center text-4xl md:text-5xl">
              Cómo se construye
            </h2>
          </div>
          {construcciones.map((c, i) => (
            <EditorialDividido key={c.clave} bloque={c} invertido={i % 2 === 1} />
          ))}
        </section>
      )}

      <Galeria fotos={[b["oficio-galeria-1"], b["oficio-galeria-2"], b["oficio-galeria-3"]]} titulo="El taller" />

      <section className="seccion text-center">
        <h2 className="titulo-display text-4xl md:text-5xl">Ver la colección</h2>
        <Link href="/coleccion" className="btn-primario mt-10">
          Ir a la colección
        </Link>
      </section>
    </>
  );
}
