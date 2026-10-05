import Link from "next/link";
import { Foto } from "@/components/ui/foto";

/** Foto vertical con el nombre abajo a la izquierda, sobre la imagen. */
export function FotoConNombre({
  href,
  titulo,
  imagen,
  nota,
  className = "",
  sizes = "(min-width: 1024px) 22vw, 78vw",
}: {
  href: string;
  titulo: string;
  imagen: { url: string; alt: string } | null;
  nota?: string;
  className?: string;
  sizes?: string;
}) {
  const conFoto = Boolean(imagen);
  return (
    <Link href={href} className={`group relative block overflow-hidden ${className}`}>
      <Foto
        imagen={imagen}
        tono="piedra"
        nota={conFoto ? undefined : nota}
        sinIlustracion
        cubrir
        zoomAlPasar
        sizes={sizes}
        className="h-full w-full"
      />
      {conFoto && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-cafe-oscuro/75 to-transparent" />
      )}
      <span className={`texto-nav absolute bottom-3 left-3 max-w-[85%] ${conFoto ? "text-crema-claro" : "text-cafe"}`}>
        {titulo}
      </span>
    </Link>
  );
}
