import type { Metadata } from "next";
import Link from "next/link";
import { getHormas } from "@/lib/data/contenido";
import { FormHorma } from "@/components/admin/form-horma";
import { Tarjeta, TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Hormas" };

export default async function HormasAdmin() {
  const lista = await getHormas();
  return (
    <>
      <TituloAdmin
        accion={
          <Link href="/nuestras-hormas" target="_blank" className="btn-contorno">
            Ver página ↗
          </Link>
        }
      >
        Hormas
      </TituloAdmin>
      <p className="mb-8 max-w-2xl text-cafe/85">
        La horma es el molde de cada modelo. Aquí defines su descripción y la recomendación de talla; luego la eliges en cada
        producto.
      </p>
      <div className="grid max-w-3xl gap-6">
        {lista.map((h) => (
          <Tarjeta key={h.id} titulo={h.nombre} className="bg-white">
            <FormHorma horma={h} />
          </Tarjeta>
        ))}
        <Tarjeta titulo="Nueva horma" className="bg-white">
          <FormHorma />
        </Tarjeta>
      </div>
    </>
  );
}
