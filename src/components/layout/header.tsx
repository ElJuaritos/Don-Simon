import { mensajesAnuncio } from "@/lib/anuncio";
import { contarCarrito } from "@/lib/carrito";
import { getCategoriasPara } from "@/lib/data/catalogo";
import { getBloques } from "@/lib/data/contenido";
import { BarraAnuncio } from "./barra-anuncio";
import { Cabecera } from "./cabecera";
import { columnasNosotros, columnasPublico, type EntradaNav, type FotoNav } from "./navegacion";

function fotosDe(
  bloques: Awaited<ReturnType<typeof getBloques>>,
  claves: string[],
): FotoNav[] {
  return claves.map((clave) => {
    const b = bloques[clave];
    return {
      href: b?.enlaceUrl || "/",
      titulo: b?.titulo || "",
      imagen: b?.imagen ?? null,
      nota: b?.notaFoto,
    };
  });
}

/** Barra de aviso y header. Los textos y las fotos salen de los cuadros editables. */
export async function Header() {
  const [cantidad, hombre, mujer, menus, global] = await Promise.all([
    contarCarrito(),
    getCategoriasPara("hombre"),
    getCategoriasPara("mujer"),
    getBloques("menus"),
    getBloques("global"),
  ]);

  const entradas: EntradaNav[] = [
    {
      tipo: "menu",
      id: "hombre",
      href: "/coleccion?para=hombre",
      texto: "Hombre",
      columnas: columnasPublico("hombre", hombre),
      fotos: fotosDe(menus, ["menu-hombre-1", "menu-hombre-2", "menu-hombre-3"]),
    },
    {
      tipo: "menu",
      id: "mujer",
      href: "/coleccion?para=mujer",
      texto: "Mujer",
      columnas: columnasPublico("mujer", mujer),
      fotos: fotosDe(menus, ["menu-mujer-1", "menu-mujer-2", "menu-mujer-3"]),
    },
    { tipo: "enlace", id: "lookbook", href: "/lookbook", texto: "Lookbook" },
    {
      tipo: "menu",
      id: "nosotros",
      href: "/nuestra-historia",
      texto: "Nosotros",
      columnas: columnasNosotros(),
      fotos: fotosDe(menus, ["menu-nosotros-1", "menu-nosotros-2", "menu-nosotros-3"]),
    },
  ];

  return (
    <>
      <BarraAnuncio mensajes={mensajesAnuncio(global["global-anuncio"]?.texto ?? "")} />
      <Cabecera entradas={entradas} cantidad={cantidad} />
    </>
  );
}
