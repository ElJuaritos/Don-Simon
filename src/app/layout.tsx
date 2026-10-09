import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import { marca } from "@/config/marca";
import { urlDelSitio } from "@/lib/sitio";
import "./globals.css";

const sans = Montserrat({
  variable: "--font-sans-marca",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Cormorant_Garamond({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
  style: "normal",
});

export const metadata: Metadata = {
  metadataBase: new URL(urlDelSitio()),
  title: {
    default: `${marca.nombre} · Calzado de piel hecho a mano`,
    template: `%s · ${marca.nombre}`,
  },
  description: marca.descripcion,
  openGraph: {
    siteName: marca.nombre,
    locale: "es_MX",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#3d516b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-MX" className={`${sans.variable} ${display.variable}`}>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
