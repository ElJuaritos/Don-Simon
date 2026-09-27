import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Pinyon_Script, Quicksand } from "next/font/google";
import { marca } from "@/config/marca";
import { urlDelSitio } from "@/lib/sitio";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const display = Cormorant_Garamond({
  variable: "--font-display-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const script = Pinyon_Script({
  variable: "--font-script-logo",
  subsets: ["latin"],
  weight: "400",
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
  themeColor: "#5d3f24",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${quicksand.variable} ${display.variable} ${script.variable}`}
    >
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
