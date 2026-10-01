import { tienda } from "@/config/marca";
import { formatPrecio } from "@/lib/formato";
import { IconoAguja, IconoCambio, IconoCamion } from "@/components/ui/iconos";

/** Tres razones para comprar, separadas por líneas finas. */
export function Valores() {
  const valores = [
    { Icono: IconoAguja, titulo: "Hecho a mano", texto: "Cortado, cosido y montado por artesanos en México." },
    {
      Icono: IconoCamion,
      titulo: "Envío a todo México",
      texto: `Gratis en compras desde ${formatPrecio(tienda.envioGratisDesde)}.`,
    },
    { Icono: IconoCambio, titulo: "Pago seguro", texto: "Con tarjeta de crédito o débito, procesado por Stripe." },
  ];
  return (
    <section className="border-y border-cafe/10" aria-label="Por qué comprar aquí">
      <ul className="contenedor grid md:grid-cols-3">
        {valores.map(({ Icono, titulo, texto }) => (
          <li key={titulo} className="flex gap-5 border-b border-cafe/10 py-10 md:border-b-0 md:border-r md:px-8 md:py-14 md:first:pl-0 md:last:border-r-0">
            <Icono width={26} height={26} strokeWidth={1.1} className="mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold">{titulo}</h3>
              <p className="mt-1.5 text-[0.9375rem] text-cafe/85">{texto}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
