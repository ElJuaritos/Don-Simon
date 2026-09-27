import Link from "next/link";

export default function NoEncontrado() {
  return (
    <div className="contenedor py-28 text-center">
      <p className="etiqueta text-terracota-oscuro">Error 404</p>
      <h1 className="titulo-display mt-3 text-5xl md:text-6xl">No encontramos esta página</h1>
      <p className="mt-4">Puede que el modelo ya no esté disponible o que el enlace haya cambiado.</p>
      <Link href="/coleccion" className="btn-primario mt-8">
        Ver colección
      </Link>
    </div>
  );
}
