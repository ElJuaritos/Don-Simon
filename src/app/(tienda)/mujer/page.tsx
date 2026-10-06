import type { Metadata } from "next";
import { marca } from "@/config/marca";
import { VistaPublico } from "@/components/publico/vista-publico";

export const metadata: Metadata = {
  title: "Mujer",
  description: `Calzado de piel para mujer de ${marca.nombre}. Mocasines, botines y zapatos hechos a mano.`,
};

export default function PaginaMujer() {
  return <VistaPublico para="mujer" />;
}
