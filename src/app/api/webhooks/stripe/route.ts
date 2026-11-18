import Stripe from "stripe";
import { cancelarPedidoPendiente, confirmarPago, registrarPagoTardio } from "@/lib/data/pedidos";
import { getStripe, metodoDePago } from "@/lib/stripe";

// Único lugar donde un pedido pasa a "pagado". Stripe firma cada evento y aquí se verifica.
// En local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

// La firma se verifica con Web Crypto: funciona igual en Node y en Cloudflare Workers.
const cripto = Stripe.createSubtleCryptoProvider();

function codigoUsado(sesion: Stripe.Checkout.Session) {
  for (const d of sesion.discounts ?? []) {
    const promo = d.promotion_code;
    if (promo && typeof promo !== "string") return promo.code;
  }
  return null;
}

async function pagar(stripe: Stripe, sesion: Stripe.Checkout.Session, pedidoId: string) {
  let descuento = sesion.total_details?.amount_discount ?? 0;
  let total = sesion.amount_total;
  let codigoDescuento: string | null = null;
  try {
    const completa = await stripe.checkout.sessions.retrieve(sesion.id, {
      expand: ["discounts.promotion_code"],
    });
    descuento = completa.total_details?.amount_discount ?? descuento;
    total = completa.amount_total ?? total;
    codigoDescuento = codigoUsado(completa);
  } catch (e) {
    console.error("No se pudo leer el cupón de la sesión", e);
  }

  const pedido = await confirmarPago(pedidoId, await metodoDePago(sesion.id), {
    descuento,
    codigoDescuento,
    ...(typeof total === "number" ? { total } : {}),
  });
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
    evento = await stripe.webhooks.constructEventAsync(await request.text(), firma, secreto, undefined, cripto);
  } catch {
    return new Response("Firma inválida", { status: 400 });
  }

  if (evento.type.startsWith("checkout.session.")) {
    const sesion = evento.data.object as Stripe.Checkout.Session;
    const pedidoId = sesion.metadata?.pedidoId;
    if (!pedidoId) return new Response("ok");

    switch (evento.type) {
      case "checkout.session.completed":
        // Un cupón del 100 % deja la sesión en no_payment_required: también es un pago confirmado.
        // Con OXXO/SPEI la sesión se completa pero el pago llega después (async_payment_succeeded).
        if (sesion.payment_status === "paid" || sesion.payment_status === "no_payment_required") {
          await pagar(stripe, sesion, pedidoId);
        }
        break;
      case "checkout.session.async_payment_succeeded":
        await pagar(stripe, sesion, pedidoId);
        break;
      case "checkout.session.async_payment_failed":
      case "checkout.session.expired":
        await cancelarPedidoPendiente(pedidoId);
        break;
    }
  }

  return new Response("ok");
}
