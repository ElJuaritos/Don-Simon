import "server-only";
import Stripe from "stripe";

export { urlDelSitio } from "@/lib/sitio";

let cliente: Stripe | null | undefined;

/** Devuelve null si Stripe no está configurado (modo demo en desarrollo). */
export function getStripe() {
  if (cliente === undefined) {
    const key = process.env.STRIPE_SECRET_KEY;
    cliente = key ? new Stripe(key) : null;
  }
  return cliente;
}
