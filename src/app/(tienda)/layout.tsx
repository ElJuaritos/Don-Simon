import { CarritoLateral } from "@/components/cart/carrito-lateral";
import { ProveedorCarrito } from "@/components/cart/proveedor-carrito";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { BotonAyuda } from "@/components/layout/boton-ayuda";
import { getCarritoDetallado } from "@/lib/carrito";

export default async function TiendaLayout({ children }: LayoutProps<"/">) {
  const carrito = await getCarritoDetallado();
  return (
    <ProveedorCarrito carrito={carrito}>
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
      <CarritoLateral />
      <BotonAyuda />
    </ProveedorCarrito>
  );
}
