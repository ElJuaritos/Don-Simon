import "server-only";
import Stripe from "stripe";

export { urlDelSitio } from "@/lib/sitio";

let cliente: Stripe | null | undefined;

/** Devuelve null si Stripe no está configurado. */
export function getStripe() {
  if (cliente === undefined) {
    const key = process.env.STRIPE_SECRET_KEY;
    cliente = key ? new Stripe(key) : null;
  }
  return cliente;
}

/** Sin llaves de Stripe, en desarrollo los pedidos se registran sin cobrar. En producción nunca. */
export function esModoDemo() {
  return !getStripe() && process.env.NODE_ENV !== "production";
}

/** Cierra una sesión de pago abierta para que el cliente ya no pueda pagarla. */
export async function expirarSesion(sessionId: string | null) {
  const stripe = getStripe();
  if (!stripe || !sessionId) return;
  try {
    await stripe.checkout.sessions.expire(sessionId);
  } catch {
    // Ya estaba pagada, expirada o cerrada: no hay nada que hacer
  }
}

/** Método con el que realmente se pagó (card, oxxo, customer_balance para SPEI…). */
export async function metodoDePago(sessionId: string) {
  const stripe = getStripe();
  if (!stripe) return null;
  try {
    const sesion = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent.payment_method"],
    });
    const intento = sesion.payment_intent;
    if (!intento || typeof intento === "string") return null;
    const metodo = intento.payment_method;
    return metodo && typeof metodo !== "string" ? metodo.type : null;
  } catch {
    return null;
  }
}
