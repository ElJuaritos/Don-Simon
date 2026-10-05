import { getBloques } from "@/lib/data/contenido";
import { EditorialDividido } from "@/components/portada/editorial-dividido";
import { FilaColeccion } from "@/components/portada/fila-coleccion";
import { PuertaPublico } from "@/components/portada/puerta-publico";

// Portada: dos puertas, dos filas de colección y un bloque editorial.
// Las fotos y los textos se editan en /admin/contenido.

export default async function Inicio() {
  const b = await getBloques("portada");

  return (
    <>
      <PuertaPublico bloques={[b["portada-hombre"], b["portada-mujer"]]} />
      <FilaColeccion
        id="coleccion-hombre"
        titulo="Colección Hombre"
        explorarHref="/coleccion?para=hombre"
        fotos={[b["portada-col-hombre-1"], b["portada-col-hombre-2"], b["portada-col-hombre-3"]]}
      />
      <FilaColeccion
        id="coleccion-mujer"
        titulo="Colección Mujer"
        explorarHref="/coleccion?para=mujer"
        fotos={[b["portada-col-mujer-1"], b["portada-col-mujer-2"], b["portada-col-mujer-3"]]}
      />
      <div className="pb-6 md:pb-12">
        <EditorialDividido bloque={b["portada-oficio"]} />
      </div>
    </>
  );
}
