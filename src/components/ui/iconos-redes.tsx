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
  "aria-hidden": true as const,
};

export const IconoInstagram = (p: P) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="16" height="16" />
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);
export const IconoFacebook = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13v-1.2c0-.5.4-.8 1-.8Z" />
  </svg>
);
export const IconoTiktok = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14 6c.6 2.4 2.2 4 4.5 4.4V13c-1.6 0-3.1-.5-4.5-1.4V16a5 5 0 1 1-5-5c.3 0 .7 0 1 .1V14a2.2 2.2 0 1 0 1.5 2.1V6H14Z" />
  </svg>
);
export const IconoPinterest = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8" />
    <path d="M11 17.5 12.2 13c-.6-.3-1.2-1-1.2-2 0-1.4 1.1-2.2 2.4-2.2 1.5 0 2.4 1 2.4 2.5 0 1.8-1 3.2-2.3 3.2-.6 0-1.1-.4-1-.9l.4-1.5" />
  </svg>
);
export const IconoYoutube = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="7" width="18" height="10" />
    <path d="m11 10 4 2-4 2v-4Z" fill="currentColor" stroke="none" />
  </svg>
);
