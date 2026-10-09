import Link from "next/link";
import { CarritoLateral } from "@/components/cart/carrito-lateral";
import { ProveedorCarrito } from "@/components/cart/proveedor-carrito";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getCarritoDetallado } from "@/lib/carrito";

export default async function NoEncontrado() {
  const carrito = await getCarritoDetallado();
  return (
    <ProveedorCarrito carrito={carrito}>
      <Header />
      <main className="contenedor flex-1 py-28 text-center">
        <p className="etiqueta text-pizarra-oscuro">Error 404</p>
        <h1 className="titulo-display mt-3 text-5xl md:text-6xl">No encontramos esta página</h1>
        <p className="mt-4">Puede que el enlace haya cambiado o que el modelo ya no esté disponible.</p>
        <Link href="/coleccion" className="btn-primario mt-8">
          Ver colección
        </Link>
      </main>
      <Footer />
      <CarritoLateral />
    </ProveedorCarrito>
  );
}
