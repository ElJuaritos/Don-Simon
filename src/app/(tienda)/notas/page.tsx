import type { Metadata } from "next";
import { marca } from "@/config/marca";
import { getNotasPublicadas } from "@/lib/data/notas";
import { formatDia } from "@/lib/formato";
import { ListaNotas } from "./lista-notas";

export const metadata: Metadata = {
  title: "Notas",
  description: `Notas del taller de ${marca.nombre}.`,
};

export default async function Notas() {
  const lista = await getNotasPublicadas();

  return (
    <div className="contenedor py-12 md:py-20">
      <p className="etiqueta text-negro/85">Journal</p>
      <h1 className="titulo-display mt-4 text-5xl md:text-7xl">Notas</h1>
      {lista.length === 0 ? (
        <p className="mt-10 max-w-md text-lg">Pronto vamos a escribir desde el taller.</p>
      ) : (
        <div className="mt-12">
          <ListaNotas
            notas={lista.map((n) => ({
              slug: n.slug,
              titulo: n.titulo,
              fecha: formatDia(n.publicadaEn ?? n.createdAt),
              imagen: n.imagenUrl ? { url: n.imagenUrl, alt: n.imagenAlt || n.titulo } : null,
            }))}
          />
        </div>
      )}
    </div>
  );
}
