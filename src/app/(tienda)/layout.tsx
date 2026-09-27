import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { BotonWhatsapp } from "@/components/layout/boton-whatsapp";

export default function TiendaLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-cafe focus:px-4 focus:py-2 focus:text-crema-claro"
      >
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <Footer />
      <BotonWhatsapp />
    </>
  );
}
