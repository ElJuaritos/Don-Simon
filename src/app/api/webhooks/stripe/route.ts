import type Stripe from "stripe";
import { cancelarPedidoPendiente, confirmarPago, registrarPagoTardio } from "@/lib/data/pedidos";
import { getStripe, metodoDePago } from "@/lib/stripe";

// Único lugar donde un pedido pasa a "pagado". Stripe firma cada evento y aquí se verifica.
// En local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

async function pagar(sesion: Stripe.Checkout.Session, pedidoId: string) {
  const pedido = await confirmarPago(pedidoId, await metodoDePago(sesion.id));
  // null = el pedido ya no estaba pendiente: reenvío del mismo evento o pago tardío
  if (!pedido) await registrarPagoTardio(pedidoId);
}

export async function POST(request: Request) {
  const stripe = getStripe();
  const secreto = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secreto) return new Response("Stripe no configurado", { status: 503 });

  const firma = request.headers.get("stripe-signature");
  if (!firma) return new Response("Falta firma", { status: 400 });

  let evento: Stripe.Event;
  try {
    evento = stripe.webhooks.constructEvent(await request.text(), firma, secreto);
  } catch {
    return new Response("Firma inválida", { status: 400 });
  }

  if (evento.type.startsWith("checkout.session.")) {
    const sesion = evento.data.object as Stripe.Checkout.Session;
    const pedidoId = sesion.metadata?.pedidoId;
    if (!pedidoId) return new Response("ok");

    switch (evento.type) {
      case "checkout.session.completed":
        // Con OXXO/SPEI la sesión se completa pero el pago llega después (async_payment_succeeded)
        if (sesion.payment_status === "paid") await pagar(sesion, pedidoId);
        break;
      case "checkout.session.async_payment_succeeded":
        await pagar(sesion, pedidoId);
        break;
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired":
        await cancelarPedidoPendiente(pedidoId);
        break;
    }
  }

  return new Response("ok");
}
