import type { Metadata } from "next";
import { marca } from "@/config/marca";
import { FormRastrear } from "./form-rastrear";

export const metadata: Metadata = {
  title: "Rastrear pedido",
  description: `Consulta el estado de tu pedido de ${marca.nombre} con el folio y el correo de la compra.`,
};

export default function Rastrear() {
  return (
    <div className="contenedor max-w-xl py-12 md:py-20">
      <h1 className="titulo-display text-5xl md:text-6xl">Rastrear pedido</h1>
      <p className="mt-4 text-lg text-negro/80">
        Escribe el folio (DS- y el número) y el correo con el que compraste.
      </p>
      <div className="mt-10">
        <FormRastrear />
      </div>
    </div>
  );
}
