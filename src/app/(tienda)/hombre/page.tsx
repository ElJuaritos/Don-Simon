import type { Metadata } from "next";
import { marca } from "@/config/marca";
import { VistaPublico } from "@/components/publico/vista-publico";

export const metadata: Metadata = {
  title: "Hombre",
  description: `Calzado de piel para hombre de ${marca.nombre}. Mocasines, botas y zapatos hechos a mano.`,
};

export default function PaginaHombre() {
  return <VistaPublico para="hombre" />;
}
