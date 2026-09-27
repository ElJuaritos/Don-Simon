import type { Metadata } from "next";
import Link from "next/link";
import { getProductos } from "@/lib/data/catalogo";
import { RejillaProductos } from "@/components/product/tarjeta-producto";

export const metadata: Metadata = { title: "Buscar", robots: { index: false } };

export default async function Buscar({ searchParams }: PageProps<"/buscar">) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 80) : "";
  const resultados = q ? await getProductos({ q }) : [];

  return (
    <div className="contenedor py-12 md:py-16">
      <h1 className="titulo-display text-5xl">Buscar</h1>
      <form method="get" action="/buscar" role="search" className="mt-8 flex max-w-xl gap-2">
        <label htmlFor="q" className="sr-only">
          ¿Qué estás buscando?
        </label>
        <input id="q" name="q" type="search" defaultValue={q} placeholder="Mocasín, bota, café…" className="campo" autoFocus />
        <button type="submit" className="btn-primario">
          Buscar
        </button>
      </form>

      {q && (
        <div className="mt-12">
          <p className="mb-8 text-cafe/80" role="status">
            {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"} para “{q}”
          </p>
          {resultados.length > 0 ? (
            <RejillaProductos productos={resultados} />
          ) : (
            <p>
              Prueba con otra palabra o{" "}
              <Link href="/coleccion" className="enlace">
                mira toda la colección
              </Link>
              .
            </p>
          )}
        </div>
      )}
    </div>
  );
}
