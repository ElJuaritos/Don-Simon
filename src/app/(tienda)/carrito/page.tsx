import type { Metadata } from "next";
import Link from "next/link";
import { tienda } from "@/config/marca";
import { cambiarCantidad } from "@/lib/actions/tienda";
import { getCarritoDetallado, type CarritoDetallado } from "@/lib/carrito";
import { formatPrecio, formatTalla } from "@/lib/formato";
import { FotoProducto } from "@/components/ui/foto";

export const metadata: Metadata = { title: "Carrito", robots: { index: false } };

export default async function Carrito({ searchParams }: PageProps<"/carrito">) {
  const [carrito, sp] = await Promise.all([getCarritoDetallado(), searchParams]);

  if (carrito.lineas.length === 0) {
    return (
      <div className="contenedor py-24 text-center">
        <h1 className="titulo-display text-5xl">Tu carrito está vacío</h1>
        <p className="mt-4">Encuentra el par que te va a acompañar muchos años.</p>
        <Link href="/coleccion" className="btn-primario mt-8">
          Ver colección
        </Link>
      </div>
    );
  }

  return (
    <div className="contenedor py-12 md:py-16">
      <h1 className="titulo-display text-5xl">Tu carrito</h1>
      {sp.pago === "cancelado" && (
        <p role="status" className="mt-6 bg-arena px-4 py-3">
          El pago no se completó. Tus productos siguen aquí cuando quieras intentarlo de nuevo.
        </p>
      )}

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_24rem]">
        <ul className="divide-y divide-cafe/10 border-y border-cafe/10">
          {carrito.lineas.map((l) => {
            const excede = l.cantidad > l.disponibles;
            const max = Math.min(tienda.maxParesPorLinea, Math.max(l.disponibles, l.cantidad));
            return (
              <li key={l.varianteId} className="flex gap-4 py-6 sm:gap-6">
                <Link href={`/producto/${l.slug}?color=${encodeURIComponent(l.color)}`} className="w-24 shrink-0 sm:w-32">
                  <FotoProducto imagen={l.imagen} colorZapato={l.colorHex} sizes="128px" className="aspect-[4/5]" />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <Link href={`/producto/${l.slug}`} className="font-semibold hover:underline">
                        {l.nombre}
                      </Link>
                      <p className="mt-1 text-sm text-cafe/85">
                        {l.color} · Talla {formatTalla(l.talla)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatPrecio(l.precioUnitario * l.cantidad)}</p>
                  </div>
                  {excede && (
                    <p className="mt-2 text-sm text-terracota-oscuro" role="alert">
                      {l.disponibles === 0
                        ? "Esta talla se agotó. Quítala para continuar."
                        : `Solo quedan ${l.disponibles} pares. Ajusta la cantidad.`}
                    </p>
                  )}
                  <div className="mt-auto flex items-center gap-4 pt-4">
                    <form action={cambiarCantidad} className="flex items-center border border-cafe/25">
                      <input type="hidden" name="varianteId" value={l.varianteId} />
                      <button
                        type="submit"
                        name="cantidad"
                        value={l.cantidad - 1}
                        aria-label="Quitar un par"
                        className="grid h-10 w-10 place-items-center hover:bg-arena"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold" aria-label="Cantidad">
                        {l.cantidad}
                      </span>
                      <button
                        type="submit"
                        name="cantidad"
                        value={l.cantidad + 1}
                        disabled={l.cantidad >= max}
                        aria-label="Agregar un par"
                        className="grid h-10 w-10 place-items-center hover:bg-crema disabled:opacity-30"
                      >
                        +
                      </button>
                    </form>
                    <form action={cambiarCantidad}>
                      <input type="hidden" name="varianteId" value={l.varianteId} />
                      <button type="submit" name="cantidad" value="0" className="enlace text-sm">
                        Quitar
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <Resumen carrito={carrito} />
      </div>
    </div>
  );
}

function Resumen({ carrito }: { carrito: CarritoDetallado }) {
  const progreso = Math.min(100, (carrito.subtotal / tienda.envioGratisDesde) * 100);
  return (
    <aside className="h-fit bg-arena p-6 lg:sticky lg:top-28" aria-labelledby="titulo-resumen">
      <h2 id="titulo-resumen" className="etiqueta">
        Resumen
      </h2>
      <div className="mt-5">
        {carrito.faltaParaEnvioGratis > 0 ? (
          <p className="text-sm">
            Te faltan <strong>{formatPrecio(carrito.faltaParaEnvioGratis)}</strong> para el envío gratis.
          </p>
        ) : (
          <p className="text-sm font-semibold">¡Tu envío es gratis!</p>
        )}
        <div className="mt-2 h-1 bg-cafe/15" role="presentation">
          <div className="h-full bg-terracota transition-all" style={{ width: `${progreso}%` }} />
        </div>
      </div>
      <dl className="mt-6 space-y-2 text-[0.9375rem]">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatPrecio(carrito.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Envío</dt>
          <dd>{carrito.envio === 0 ? "Gratis" : formatPrecio(carrito.envio)}</dd>
        </div>
        <div className="flex justify-between border-t border-cafe/15 pt-3 text-lg font-semibold">
          <dt>Total</dt>
          <dd>{formatPrecio(carrito.total)}</dd>
        </div>
      </dl>
      <p className="mt-1 text-xs text-cafe/85">IVA incluido</p>
      {carrito.hayProblemasDeStock ? (
        <p className="btn-primario mt-6 w-full opacity-50" aria-disabled>
          Ajusta tu carrito para continuar
        </p>
      ) : (
        <Link href="/checkout" className="btn-primario mt-6 w-full">
          Continuar al pago
        </Link>
      )}
      <Link href="/coleccion" className="enlace mt-4 block text-center text-sm">
        Seguir comprando
      </Link>
    </aside>
  );
}
