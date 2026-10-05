import Link from "next/link";
import { Foto } from "@/components/ui/foto";
import type { FotoLookbook } from "@/lib/data/lookbook";

function agrupar(fotos: FotoLookbook[]) {
  const grupos: { tipo: "ancha" | "par"; fotos: FotoLookbook[] }[] = [];
  let i = 0;
  let ancha = true;
  while (i < fotos.length) {
    if (ancha || i + 1 >= fotos.length) {
      grupos.push({ tipo: "ancha", fotos: [fotos[i]] });
      i += 1;
      ancha = false;
    } else {
      grupos.push({ tipo: "par", fotos: fotos.slice(i, i + 2) });
      i += 2;
      ancha = true;
    }
  }
  return grupos;
}

function Marco({ foto, ancha, prioridad = false }: { foto: FotoLookbook; ancha: boolean; prioridad?: boolean }) {
  const clase = ancha
    ? "group relative block h-[100svh] snap-start lg:h-auto lg:aspect-[16/9]"
    : "group relative block h-[100svh] snap-start lg:h-auto lg:aspect-[3/4]";
  const conFoto = Boolean(foto.imagen);
  const imagen = (
    <>
      <Foto
        imagen={foto.imagen}
        tono="piedra"
        nota={conFoto ? undefined : foto.alt}
        sinIlustracion
        cubrir
        prioridad={prioridad}
        sizes={ancha ? "100vw" : "(min-width: 1024px) 50vw, 100vw"}
        className="h-full w-full"
      />
      {foto.producto && (
        <>
          {conFoto && (
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-cafe-oscuro/70 to-transparent" />
          )}
          <span className={`enlace-nav absolute bottom-6 left-5 ${conFoto ? "text-crema-claro" : "text-cafe"}`} aria-hidden>
            Ver el modelo
          </span>
        </>
      )}
    </>
  );
  if (!foto.producto) return <figure className={clase}>{imagen}</figure>;
  return (
    <Link href={`/producto/${foto.producto.slug}`} className={clase} aria-label={`Ver ${foto.producto.nombre}`}>
      {imagen}
    </Link>
  );
}

/** Galería editorial: una foto ancha y luego una pareja, en ciclo. En el celular, una por pantalla. */
export function GaleriaLookbook({ fotos }: { fotos: FotoLookbook[] }) {
  const grupos = agrupar(fotos);
  const primera = fotos[0]?.id;
  return (
    <div className="max-lg:snap-y max-lg:snap-mandatory">
      {grupos.map((grupo) =>
        grupo.tipo === "ancha" ? (
          <Marco key={grupo.fotos[0].id} foto={grupo.fotos[0]} ancha prioridad={grupo.fotos[0].id === primera} />
        ) : (
          <div key={grupo.fotos.map((f) => f.id).join("-")} className="lg:grid lg:grid-cols-2">
            {grupo.fotos.map((foto) => (
              <Marco key={foto.id} foto={foto} ancha={false} prioridad={foto.id === primera} />
            ))}
          </div>
        ),
      )}
    </div>
  );
}
