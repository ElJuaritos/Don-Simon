import type { Metadata } from "next";
import { formatTalla } from "@/lib/formato";
import { prepararResena } from "@/lib/data/resenas";
import { leerTokenResena } from "@/lib/resena-token";
import { nombreParaMostrar } from "@/lib/resenas-texto";
import { FotoProducto } from "@/components/ui/foto";
import { FormResena } from "./form-resena";

export const metadata: Metadata = {
  title: "Tu reseña",
  robots: { index: false, follow: false },
};

const MENSAJE = {
  vencido: "Este enlace venció.",
  invalido: "Este enlace no es válido.",
  usada: "Este enlace ya se usó.",
  "no-entregado": "Este pedido todavía no se marca como entregado. Cuando llegue, podrás dejar tu reseña.",
  "no-encontrado": "No encontramos este pedido.",
} as const;

export default async function PaginaResena({ params, searchParams }: PageProps<"/resena/[token]">) {
  const { token } = await params;
  const enviada = (await searchParams).enviada === "1";
  const leido = await leerTokenResena(token);
  if (!leido.ok) return <Aviso texto={MENSAJE[leido.motivo]} />;

  const lista = await prepararResena(leido.lineaId);
  if (!lista.ok) {
    if (lista.motivo === "usada" && enviada) {
      return (
        <div className="contenedor max-w-xl py-16 md:py-24">
          <p className="text-lg" role="status">
            Gracias. Tu reseña se publicará cuando la revisemos.
          </p>
        </div>
      );
    }
    return <Aviso texto={MENSAJE[lista.motivo]} />;
  }
  const p = lista.linea;

  return (
    <div className="contenedor max-w-3xl py-10 md:py-16">
      <p className="text-sm text-cafe/70">Tu reseña</p>
      <div className="mt-4 flex items-center gap-4">
        <FotoProducto imagen={p.imagen} sizes="96px" className="h-24 w-20 shrink-0" />
        <div>
          <h1 className="font-sans text-2xl font-medium">{p.nombre}</h1>
          <p className="mt-1 text-sm text-cafe/75">
            {p.color} · Talla {formatTalla(p.talla)}
          </p>
        </div>
      </div>
      <div className="mt-8">
        <FormResena token={token} nombre={nombreParaMostrar(p.nombreCliente)} ciudad={p.ciudad} />
      </div>
    </div>
  );
}

function Aviso({ texto }: { texto: string }) {
  return (
    <div className="contenedor max-w-xl py-16 md:py-24">
      <h1 className="font-sans text-2xl font-medium">No pudimos abrir este enlace</h1>
      <p className="mt-4 text-cafe/80">{texto}</p>
    </div>
  );
}
