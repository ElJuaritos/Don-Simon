import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCarritoDetallado } from "@/lib/carrito";
import { esModoDemo, getStripe } from "@/lib/stripe";
import { FormCheckout } from "./form-checkout";
import { ResumenCheckout } from "./resumen-checkout";

export const metadata: Metadata = { title: "Pago", robots: { index: false } };

export default async function Checkout() {
  const carrito = await getCarritoDetallado();
  if (carrito.lineas.length === 0 || carrito.hayProblemasDeStock) redirect("/carrito");
  const modoDemo = esModoDemo();
  const sinPagos = !getStripe() && !modoDemo;

  return (
    <div className="contenedor py-10 md:py-14">
      <h1 className="font-sans text-2xl font-medium md:text-3xl">Finalizar compra</h1>
      {sinPagos && (
        <p role="alert" className="mt-6 border-l-4 border-terracota bg-arena px-4 py-3 text-sm">
          Los pagos no están disponibles en este momento. Intenta más tarde.
        </p>
      )}
      {modoDemo && (
        <p className="mt-6 border-l-4 border-terracota bg-arena px-4 py-3 text-sm">
          <strong>Modo demo:</strong> Stripe todavía no está configurado. El pedido se registra, pero no se cobra.
        </p>
      )}
      <div className="mt-8 flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-16">
        <ResumenCheckout />
        <FormCheckout modoDemo={modoDemo} sinPagos={sinPagos} />
      </div>
    </div>
  );
}
