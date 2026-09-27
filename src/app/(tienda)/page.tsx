import Link from "next/link";
import { marca, tienda } from "@/config/marca";
import { formatPrecio } from "@/lib/formato";
import { getCategorias, getProductos } from "@/lib/data/catalogo";
import { FormNewsletter } from "@/components/layout/form-newsletter";
import { RejillaProductos } from "@/components/product/tarjeta-producto";
import { FotoPendiente, type Tono } from "@/components/ui/foto";
import { IconoAguja, IconoCambio, IconoCamion, IconoFlecha } from "@/components/ui/iconos";
import { Logo } from "@/components/ui/logo";

const TONOS_CATEGORIA: Tono[] = ["cafe", "olivo", "terracota"];

export default async function Inicio() {
  const [categorias, destacados] = await Promise.all([
    getCategorias(),
    getProductos({ soloDestacados: true, limite: 4 }),
  ]);

  return (
    <>
      {/* Hero: se reemplaza el fondo por la foto de producto en contexto natural */}
      <section className="textura relative isolate flex min-h-[78svh] items-center justify-center overflow-hidden bg-cafe text-crema-claro">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_120%,#a85f3e55,transparent_60%)]" />
        <p className="etiqueta absolute bottom-4 left-4 text-[0.625rem] text-crema/75">
          Foto: mocasín sobre piedra, luz de tarde
        </p>
        <div className="contenedor aparecer flex flex-col items-center py-24 text-center">
          <h1 className="text-[4.5rem] sm:text-[6.5rem] md:text-[8rem]">
            <Logo conFecha />
            <span className="sr-only"> · Calzado de piel hecho a mano</span>
          </h1>
          <p className="titulo-display mt-8 max-w-xl text-2xl text-crema md:text-3xl">
            Calzado de piel hecho a mano, pensado para durar.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/coleccion" className="btn-claro">
              Ver colección
            </Link>
            <Link href="/nuestra-historia" className="btn-contorno-claro">
              Nuestra historia
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="contenedor py-20 md:py-28" aria-labelledby="titulo-categorias">
        <div className="mb-10 flex items-end justify-between gap-6">
          <h2 id="titulo-categorias" className="titulo-display text-4xl md:text-5xl">
            Encuentra tu par
          </h2>
          <Link href="/coleccion" className="etiqueta hidden items-center gap-2 hover:opacity-70 sm:inline-flex">
            Ver todo <IconoFlecha width={18} />
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-3">
          {categorias.map((c, i) => (
            <li key={c.id}>
              <Link href={`/coleccion/${c.slug}`} className="group relative block overflow-hidden">
                <FotoPendiente
                  tono={TONOS_CATEGORIA[i % TONOS_CATEGORIA.length]}
                  className="aspect-[4/5] transition-transform duration-700 ease-suave group-hover:scale-[1.03] sm:aspect-[3/4]"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/35 to-transparent p-6 text-white">
                  <h3 className="titulo-display text-4xl">{c.nombre}</h3>
                  <IconoFlecha className="mb-2 transition-transform duration-500 group-hover:translate-x-1" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Destacados */}
      {destacados.length > 0 && (
        <section className="border-t border-cafe/10 bg-crema/40 py-20 md:py-28" aria-labelledby="titulo-destacados">
          <div className="contenedor">
            <p className="etiqueta text-terracota-oscuro">Selección de la casa</p>
            <h2 id="titulo-destacados" className="titulo-display mt-3 mb-12 text-4xl md:text-5xl">
              Los favoritos
            </h2>
            <RejillaProductos productos={destacados} />
          </div>
        </section>
      )}

      {/* El oficio */}
      <section className="grid md:grid-cols-2" aria-labelledby="titulo-oficio">
        <FotoPendiente
          tono="olivo"
          nota="manos cortando piel en el taller"
          sinIlustracion
          className="aspect-[4/3] md:aspect-auto md:min-h-[36rem]"
        />
        <div className="flex items-center bg-crema px-6 py-16 md:px-16">
          <div className="max-w-md">
            <p className="etiqueta text-terracota-oscuro">El oficio</p>
            <h2 id="titulo-oficio" className="titulo-display mt-3 text-4xl md:text-5xl">
              Hecho a mano, paso a paso.
            </h2>
            <p className="mt-6">
              Cada par pasa por las manos de artesanos que cortan, cosen y montan la piel como se ha hecho por
              generaciones. Sin prisas y sin atajos, porque un buen zapato se nota con los años.
            </p>
            <Link href="/nuestra-historia" className="btn-contorno mt-8">
              Conoce la casa
            </Link>
          </div>
        </div>
      </section>

      {/* Atributos */}
      <section className="textura bg-terracota py-16 text-white md:py-20">
        <ul className="contenedor grid gap-10 text-center md:grid-cols-3">
          {[
            { Icono: IconoAguja, titulo: "Hecho a mano", texto: "Cosido y montado por artesanos mexicanos." },
            {
              Icono: IconoCamion,
              titulo: "Envío a todo México",
              texto: `Gratis en compras desde ${formatPrecio(tienda.envioGratisDesde)}.`,
            },
            { Icono: IconoCambio, titulo: "Pago seguro", texto: "Con tarjeta de crédito o débito, procesado por Stripe." },
          ].map(({ Icono, titulo, texto }) => (
            <li key={titulo} className="flex flex-col items-center">
              <Icono width={36} height={36} strokeWidth={1.1} />
              <h3 className="titulo-display mt-4 text-3xl">{titulo}</h3>
              <p className="mt-2 max-w-xs">{texto}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Newsletter */}
      <section className="contenedor py-20 text-center md:py-28" aria-labelledby="titulo-newsletter">
        <h2 id="titulo-newsletter" className="titulo-display text-4xl md:text-5xl">
          Sé el primero en saberlo
        </h2>
        <p className="mx-auto mt-4 max-w-md">
          Nuevos modelos, piezas limitadas y noticias del taller de {marca.nombre}. Sin spam.
        </p>
        <div className="mx-auto mt-8 max-w-lg">
          <FormNewsletter origen="portada" oscuro={false} />
        </div>
      </section>
    </>
  );
}
