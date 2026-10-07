import type { Metadata } from "next";
import Link from "next/link";
import { getPieles } from "@/lib/data/pieles";
import { FormPiel } from "@/components/admin/form-piel";
import { Tarjeta, TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Pieles" };

export default async function PielesAdmin() {
  const lista = await getPieles();
  return (
    <>
      <TituloAdmin
        accion={
          <Link href="/pieles" target="_blank" className="btn-contorno">
            Ver página ↗
          </Link>
        }
      >
        Pieles
      </TituloAdmin>
      <p className="mb-8 max-w-2xl text-cafe/85">
        Cada piel aparece en la página Pieles, con su foto, su descripción y cómo cuidarla. Si desmarcas «Mostrar», deja de verse en la tienda.
      </p>
      <div className="grid max-w-3xl gap-6">
        {lista.map((p) => (
          <Tarjeta key={p.id} titulo={p.nombre} className="bg-white">
            <FormPiel piel={p} />
          </Tarjeta>
        ))}
        <Tarjeta titulo="Nueva piel" className="bg-white">
          <FormPiel />
        </Tarjeta>
      </div>
    </>
  );
}
