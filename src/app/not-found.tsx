import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function NoEncontrado() {
  return (
    <>
      <Header />
      <main className="contenedor flex-1 py-28 text-center">
        <p className="etiqueta text-terracota-oscuro">Error 404</p>
        <h1 className="titulo-display mt-3 text-5xl md:text-6xl">No encontramos esta página</h1>
        <p className="mt-4">Puede que el enlace haya cambiado o que el modelo ya no esté disponible.</p>
        <Link href="/coleccion" className="btn-primario mt-8">
          Ver colección
        </Link>
      </main>
      <Footer />
    </>
  );
}
