// Equivalencias de referencia. Confirmar con la horma real del taller antes de publicarlas como definitivas.
// Hombre y mujer no comparten la misma tabla. Unisex muestra las dos.

export type FilaTalla = { mx: string; us: string; eu: string; uk: string; cm: string };
export type SistemaTalla = "mx" | "us" | "eu";
export type PublicoTalla = "hombre" | "mujer" | "unisex";

export const EQUIVALENCIAS_HOMBRE: FilaTalla[] = [
  { mx: "25", us: "7", eu: "40", uk: "6", cm: "25.0" },
  { mx: "25.5", us: "7.5", eu: "40.5", uk: "6.5", cm: "25.5" },
  { mx: "26", us: "8", eu: "41", uk: "7", cm: "26.0" },
  { mx: "26.5", us: "8.5", eu: "41.5", uk: "7.5", cm: "26.5" },
  { mx: "27", us: "9", eu: "42", uk: "8", cm: "27.0" },
  { mx: "27.5", us: "9.5", eu: "42.5", uk: "8.5", cm: "27.5" },
  { mx: "28", us: "10", eu: "43", uk: "9", cm: "28.0" },
  { mx: "28.5", us: "10.5", eu: "43.5", uk: "9.5", cm: "28.5" },
  { mx: "29", us: "11", eu: "44", uk: "10", cm: "29.0" },
];

export const EQUIVALENCIAS_MUJER: FilaTalla[] = [
  { mx: "22", us: "5", eu: "35", uk: "3", cm: "22.0" },
  { mx: "22.5", us: "5.5", eu: "35.5", uk: "3.5", cm: "22.5" },
  { mx: "23", us: "6", eu: "36", uk: "4", cm: "23.0" },
  { mx: "23.5", us: "6.5", eu: "37", uk: "4.5", cm: "23.5" },
  { mx: "24", us: "7", eu: "37.5", uk: "5", cm: "24.0" },
  { mx: "24.5", us: "7.5", eu: "38", uk: "5.5", cm: "24.5" },
  { mx: "25", us: "8", eu: "38.5", uk: "6", cm: "25.0" },
  { mx: "25.5", us: "8.5", eu: "39", uk: "6.5", cm: "25.5" },
  { mx: "26", us: "9", eu: "40", uk: "7", cm: "26.0" },
];

/** La tabla de hombre, para quien ya importaba EQUIVALENCIAS. */
export const EQUIVALENCIAS = EQUIVALENCIAS_HOMBRE;

const TABLAS = { hombre: EQUIVALENCIAS_HOMBRE, mujer: EQUIVALENCIAS_MUJER } as const;

function buscar(tabla: FilaTalla[], talla: number) {
  return tabla.find((f) => Math.abs(Number(f.mx) - talla) < 0.001);
}

/**
 * Etiqueta del botón de talla. Solo cambia el texto (MX, US o EU); el valor que se compra sigue siendo la talla MX.
 * Unisex usa la tabla de hombre cuando la talla está ahí: esos modelos se numeran como calzado de hombre.
 * La guía muestra las dos tablas.
 */
export function etiquetaTalla(talla: number, sistema: SistemaTalla, publico: PublicoTalla) {
  const orden = publico === "mujer" ? (["mujer"] as const) : (["hombre", "mujer"] as const);
  const fila = orden.map((p) => buscar(TABLAS[p], talla)).find(Boolean);
  if (!fila) return Number.isInteger(talla) ? String(talla) : talla.toFixed(1);
  return fila[sistema];
}

function Tabla({ filas, titulo }: { filas: FilaTalla[]; titulo?: string }) {
  return (
    <div className="overflow-x-auto">
      {titulo && <h3 className="mb-2 font-medium">{titulo}</h3>}
      <table className="w-full min-w-[22rem] text-center text-sm">
        <caption className="sr-only">
          Equivalencia de tallas MX, US, EU, UK y centímetros{titulo ? ` de ${titulo.toLowerCase()}` : ""}
        </caption>
        <thead>
          <tr className="border-b border-negro/30">
            {["MX", "US", "EU", "UK", "Pie (cm)"].map((h) => (
              <th key={h} scope="col" className="etiqueta py-2.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f) => (
            <tr key={f.mx} className="border-b border-negro/10">
              <th scope="row" className="py-2 font-semibold">
                {f.mx}
              </th>
              <td>{f.us}</td>
              <td>{f.eu}</td>
              <td>{f.uk}</td>
              <td>{f.cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Sin público, o con unisex, muestra hombre y mujer. */
export function TablaTallas({
  publico,
  className = "",
}: {
  publico?: PublicoTalla;
  className?: string;
}) {
  const ambas = !publico || publico === "unisex";
  return (
    <div className={`space-y-8 ${className}`}>
      {(ambas || publico === "hombre") && <Tabla filas={EQUIVALENCIAS_HOMBRE} titulo={ambas ? "Hombre" : undefined} />}
      {(ambas || publico === "mujer") && <Tabla filas={EQUIVALENCIAS_MUJER} titulo={ambas ? "Mujer" : undefined} />}
    </div>
  );
}
