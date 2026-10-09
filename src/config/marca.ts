import { formatPrecio } from "@/lib/formato";

// Datos de la marca en un solo lugar. No escribas el nombre ni el dominio a mano en otros archivos.

export const marca = {
  nombre: "Varen",
  fundada: 2026,
  lema: "Hecho a mano, paso a paso.",
  descripcion:
    "Calzado de piel hecho a mano en México. Piezas premium, duraderas y pensadas para acompañarte muchos años.",
  // TODO: el dominio de Varen todavía no está elegido. Déjalo vacío; no se muestra en la tienda.
  dominio: "",
  // Vacíos hasta crearlos (docs/08 #11 y #12); la interfaz los oculta si no hay valor
  email: "", // se llena cuando exista el buzón, en el dominio que se elija
  whatsapp: "", // formato 521XXXXXXXXXX
  instagram: "",
  facebook: "",
  tiktok: "",
  pinterest: "",
  youtube: "",
};

const envioGratisDesde = 250000;

export const tienda = {
  moneda: "MXN",
  // Montos en centavos
  costoEnvio: 19900,
  envioGratisDesde,
  maxParesPorLinea: 5,
  /** La tienda no muestra reseñas hasta tener al menos esta cantidad publicadas. */
  resenasMinimas: 10,
  /** Cambios y devoluciones gratis, contados desde la entrega. */
  diasCambios: 30,
  anuncio: `Envío gratis a todo México en compras desde ${formatPrecio(envioGratisDesde)}`,
  // OXXO y SPEI se muestran cuando se activen (docs/08 #2). La paquetería, cuando se defina (#8).
  pagos: { visa: true, mastercard: true, amex: true, oxxo: false, spei: false } as const,
};
