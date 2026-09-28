import { formatPrecio } from "@/lib/formato";

// Datos de la marca en un solo lugar. El nombre todavía puede cambiar
// (ver docs/08-decisiones-pendientes.md #0), así que no lo escribas a mano en otros archivos.

export const marca = {
  nombre: "Don Simon",
  fundada: 2026,
  lema: "Hecho a mano, paso a paso.",
  descripcion:
    "Calzado de piel hecho a mano en México. Piezas premium, duraderas y pensadas para acompañarte muchos años.",
  // Vacíos hasta definir dominio y redes (docs/08 #11 y #12); la interfaz los oculta si no hay valor
  email: "",
  whatsapp: "", // formato 521XXXXXXXXXX
  instagram: "",
  facebook: "",
  tiktok: "",
};

const envioGratisDesde = 250000;

export const tienda = {
  moneda: "MXN",
  // Montos en centavos
  costoEnvio: 19900,
  envioGratisDesde,
  maxParesPorLinea: 5,
  anuncio: `Envío gratis a todo México en compras desde ${formatPrecio(envioGratisDesde)}`,
};
