import type { SVGProps } from "react";
import { tienda } from "@/config/marca";

type P = SVGProps<SVGSVGElement>;

function Marca({ etiqueta, children, ...p }: P & { etiqueta: string }) {
  return (
    <svg role="img" aria-label={etiqueta} height={18} fill="currentColor" {...p}>
      <title>{etiqueta}</title>
      {children}
    </svg>
  );
}

const Visa = () => (
  <Marca etiqueta="Visa" viewBox="0 0 48 16" width={42}>
    <text x="0" y="13" fontSize="14" fontStyle="italic" fontWeight="700">
      VISA
    </text>
  </Marca>
);
const Mastercard = () => (
  <Marca etiqueta="Mastercard" viewBox="0 0 36 22" width={32}>
    <circle cx="13" cy="11" r="8" opacity="0.95" />
    <circle cx="23" cy="11" r="8" opacity="0.55" />
  </Marca>
);
const Amex = () => (
  <Marca etiqueta="American Express" viewBox="0 0 46 16" width={46}>
    <text x="0" y="12" fontSize="11" fontWeight="700" letterSpacing="0.5">
      AMEX
    </text>
  </Marca>
);
const Oxxo = () => (
  <Marca etiqueta="OXXO" viewBox="0 0 46 16" width={42}>
    <text x="0" y="12" fontSize="12" fontWeight="700">
      OXXO
    </text>
  </Marca>
);
const Spei = () => (
  <Marca etiqueta="SPEI" viewBox="0 0 40 16" width={38}>
    <text x="0" y="12" fontSize="12" fontWeight="700">
      SPEI
    </text>
  </Marca>
);

const MARCAS = { visa: Visa, mastercard: Mastercard, amex: Amex, oxxo: Oxxo, spei: Spei };

/** Logos de los métodos que ya están activos. El resto se enciende en la configuración de la tienda. */
export function LogosPago({ className = "" }: { className?: string }) {
  const activos = (Object.keys(MARCAS) as (keyof typeof MARCAS)[]).filter((id) => tienda.pagos[id]);
  if (activos.length === 0) return null;
  return (
    <ul aria-label="Métodos de pago" className={`flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
      {activos.map((id) => {
        const Logo = MARCAS[id];
        return (
          <li key={id}>
            <Logo />
          </li>
        );
      })}
    </ul>
  );
}
