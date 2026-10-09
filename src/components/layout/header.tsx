import { seMuestranResenas } from "@/lib/data/resenas";
import { hayNotasPublicadas } from "@/lib/data/notas";
import { hayPielesActivas } from "@/lib/data/pieles";
import { mensajesAnuncio } from "@/lib/anuncio";
import { fotoDeCategoria, getCategoriasPara, hayAccesoriosActivos } from "@/lib/data/catalogo";
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
  const [hombre, mujer, accesoriosHombre, accesoriosMujer, menus, global, conResenas, conPieles, conNotas, conAccesorios] =
    await Promise.all([
      getCategoriasPara("hombre"),
      getCategoriasPara("mujer"),
      getCategoriasPara("hombre", "accesorio"),
      getCategoriasPara("mujer", "accesorio"),
      getBloques("menus"),
      getBloques("global"),
      seMuestranResenas(),
      hayPielesActivas(),
      hayNotasPublicadas(),
      hayAccesoriosActivos(),
    ]);

  const entradas: EntradaNav[] = [
    {
      tipo: "menu",
      id: "hombre",
      href: "/hombre",
      texto: "Hombre",
      columnas: columnasPublico(
        "hombre",
        hombre.map((c) => ({ slug: c.slug, nombre: c.nombre, imagen: fotoDeCategoria(c, "hombre") })),
        accesoriosHombre.map((c) => ({ slug: c.slug, nombre: c.nombre, imagen: fotoDeCategoria(c, "hombre") })),
      ),
      fotos: fotosDe(menus, ["menu-hombre-1", "menu-hombre-2", "menu-hombre-3"]),
    },
    {
      tipo: "menu",
      id: "mujer",
      href: "/mujer",
      texto: "Mujer",
      columnas: columnasPublico(
        "mujer",
        mujer.map((c) => ({ slug: c.slug, nombre: c.nombre, imagen: fotoDeCategoria(c, "mujer") })),
        accesoriosMujer.map((c) => ({ slug: c.slug, nombre: c.nombre, imagen: fotoDeCategoria(c, "mujer") })),
      ),
      fotos: fotosDe(menus, ["menu-mujer-1", "menu-mujer-2", "menu-mujer-3"]),
    },
    ...(conAccesorios ? [{ tipo: "enlace" as const, id: "accesorios", href: "/accesorios", texto: "Accesorios" }] : []),
    { tipo: "enlace", id: "lookbook", href: "/lookbook", texto: "Lookbook" },
    {
      tipo: "menu",
      id: "nosotros",
      href: "/nuestra-historia",
      texto: "Nosotros",
      columnas: columnasNosotros({ resenas: conResenas, pieles: conPieles, notas: conNotas }),
      fotos: fotosDe(menus, ["menu-nosotros-1", "menu-nosotros-2", "menu-nosotros-3"]),
    },
    ...(conResenas ? [{ tipo: "enlace" as const, id: "resenas", href: "/resenas", texto: "Reseñas" }] : []),
  ];

  return (
    <div className="sticky top-0 z-40 border-b border-negro/10 lg:border-b-0">
      <BarraAnuncio mensajes={mensajesAnuncio(global["global-anuncio"]?.texto ?? "")} />
      <Cabecera entradas={entradas} />
    </div>
  );
}
