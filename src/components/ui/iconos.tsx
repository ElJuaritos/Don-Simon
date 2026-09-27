import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconoBolsa = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 8h14l-1 12H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const IconoBuscar = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4 4" />
  </svg>
);
export const IconoMenu = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h10" />
  </svg>
);
export const IconoCerrar = (p: P) => (
  <svg {...base} {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);
export const IconoFlecha = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14m-5-5 5 5-5 5" />
  </svg>
);
export const IconoCamion = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7" />
    <circle cx="7" cy="17" r="1.8" />
    <circle cx="17" cy="17" r="1.8" />
  </svg>
);
export const IconoAguja = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 20 18 6" />
    <ellipse cx="19" cy="5" rx="1.2" ry="2" transform="rotate(45 19 5)" />
    <path d="M6 12c3-4 9-2 8 3s-6 5-8 3" strokeDasharray="1.5 2" />
  </svg>
);
export const IconoCambio = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 9h13l-3-3M20 15H7l3 3" />
  </svg>
);
export const IconoWhatsapp = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 20l1.2-3.6A8 8 0 1 1 8 19.1L4 20Z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.4-1.8-1-1 .8c-1-.4-1.8-1.2-2.2-2.2l.8-1-1-1.8L9 9.5Z" />
  </svg>
);
