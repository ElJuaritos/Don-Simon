import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tu cuenta",
  description: "Pronto podrás ver tus pedidos y tus datos desde aquí.",
};

/** La cuenta de cliente llega en una etapa posterior. Por ahora solo avisa. */
export default function Cuenta() {
  return (
    <div className="contenedor flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="etiqueta text-cafe/85">Tu cuenta</p>
      <h1 className="titulo-display mt-3 text-4xl md:text-5xl">Próximamente</h1>
      <p className="mt-4 max-w-md text-lg">Aquí vas a ver tus pedidos y tus datos. Mientras tanto, puedes comprar sin crear una cuenta.</p>
    </div>
  );
}
