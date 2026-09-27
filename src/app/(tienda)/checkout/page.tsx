import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCarritoDetallado } from "@/lib/carrito";
import { formatPrecio, formatTalla } from "@/lib/formato";
import { getStripe } from "@/lib/stripe";
import { FormCheckout } from "./form-checkout";

export const metadata: Metadata = { title: "Pago", robots: { index: false } };

export default async function Checkout() {
  const carrito = await getCarritoDetallado();
  if (carrito.lineas.length === 0 || carrito.hayProblemasDeStock) redirect("/carrito");
  const modoDemo = !getStripe();

  return (
    <div className="contenedor py-12 md:py-16">
      <h1 className="titulo-display text-5xl">Datos de envío</h1>
      {modoDemo && (
        <p className="mt-6 border-l-4 border-terracota bg-crema px-4 py-3 text-sm">
          <strong>Modo demo:</strong> Stripe todavía no está configurado. El pedido se registra, pero no se cobra.
        </p>
      )}
      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem]">
        <FormCheckout />
        <aside className="h-fit bg-crema/60 p-6 lg:sticky lg:top-28" aria-labelledby="titulo-pedido">
          <h2 id="titulo-pedido" className="etiqueta">
            Tu pedido
          </h2>
          <ul className="mt-4 space-y-3 text-[0.9375rem]">
            {carrito.lineas.map((l) => (
              <li key={l.varianteId} className="flex justify-between gap-4">
                <span>
                  {l.cantidad} × {l.nombre}
                  <span className="block text-sm text-cafe/85">
                    {l.color} · Talla {formatTalla(l.talla)}
                  </span>
                </span>
                <span>{formatPrecio(l.precioUnitario * l.cantidad)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-cafe/15 pt-4 text-[0.9375rem]">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatPrecio(carrito.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Envío</dt>
              <dd>{carrito.envio === 0 ? "Gratis" : formatPrecio(carrito.envio)}</dd>
            </div>
            <div className="flex justify-between pt-2 text-lg font-semibold">
              <dt>Total</dt>
              <dd>{formatPrecio(carrito.total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
