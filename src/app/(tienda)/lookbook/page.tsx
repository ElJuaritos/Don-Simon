import type { Metadata } from "next";
import Link from "next/link";
import { marca } from "@/config/marca";
import { getBloques } from "@/lib/data/contenido";
import { getLookbook } from "@/lib/data/lookbook";
import { GaleriaLookbook } from "@/components/lookbook/galeria-lookbook";

export const metadata: Metadata = {
  title: "Lookbook",
  description: `Fotos de la temporada de ${marca.nombre}. Calzado de piel hecho a mano.`,
};

const FILTROS = [
  { href: "/lookbook", texto: "Todo", valor: undefined },
  { href: "/lookbook?para=hombre", texto: "Hombre", valor: "hombre" },
  { href: "/lookbook?para=mujer", texto: "Mujer", valor: "mujer" },
] as const;

export default async function Lookbook({
  searchParams,
}: {
  searchParams: Promise<{ para?: string | string[] }>;
}) {
  const sp = await searchParams;
  const crudo = Array.isArray(sp.para) ? sp.para[0] : sp.para;
  const para = crudo === "hombre" || crudo === "mujer" ? crudo : undefined;
  const [fotos, bloques] = await Promise.all([getLookbook(para), getBloques("lookbook")]);
  const intro = bloques["lookbook-intro"];

  return (
    <>
      <header className="contenedor py-12 text-center md:py-16">
        <h1 className="text-2xl font-medium md:text-[1.75rem]">{intro?.titulo || "Lookbook"}</h1>
        {intro?.texto && <p className="mx-auto mt-3 max-w-md text-cafe/80">{intro.texto}</p>}
        <nav aria-label="Filtrar lookbook" className="texto-nav mt-8 flex justify-center gap-6">
          {FILTROS.map((f) => {
            const activo = f.valor === para;
            return (
              <Link
                key={f.texto}
                href={f.href}
                aria-current={activo ? "page" : undefined}
                className={`border-b pb-1 ${activo ? "border-cafe" : "border-transparent text-cafe/75 hover:text-cafe"}`}
              >
                {f.texto}
              </Link>
            );
          })}
        </nav>
      </header>
      {fotos.length > 0 ? (
        <GaleriaLookbook fotos={fotos} />
      ) : (
        <p className="contenedor pb-24 text-center text-lg">Todavía no hay fotos en esta selección.</p>
      )}
    </>
  );
}
