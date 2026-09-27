// Equivalencias de referencia para calzado de caballero. Confirmar con la horma real del taller.
export const EQUIVALENCIAS = [
  { mx: "25", us: "7", eu: "40", cm: "25.0" },
  { mx: "25.5", us: "7.5", eu: "40.5", cm: "25.5" },
  { mx: "26", us: "8", eu: "41", cm: "26.0" },
  { mx: "26.5", us: "8.5", eu: "41.5", cm: "26.5" },
  { mx: "27", us: "9", eu: "42", cm: "27.0" },
  { mx: "27.5", us: "9.5", eu: "42.5", cm: "27.5" },
  { mx: "28", us: "10", eu: "43", cm: "28.0" },
  { mx: "28.5", us: "10.5", eu: "43.5", cm: "28.5" },
  { mx: "29", us: "11", eu: "44", cm: "29.0" },
];

export function TablaTallas({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full min-w-[20rem] text-center text-sm">
        <caption className="sr-only">Equivalencia de tallas MX, US, EU y centímetros</caption>
        <thead>
          <tr className="border-b border-cafe/30">
            {["MX", "US", "EU", "Pie (cm)"].map((h) => (
              <th key={h} scope="col" className="etiqueta py-2.5">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EQUIVALENCIAS.map((f) => (
            <tr key={f.mx} className="border-b border-cafe/10">
              <th scope="row" className="py-2 font-semibold">
                {f.mx}
              </th>
              <td>{f.us}</td>
              <td>{f.eu}</td>
              <td>{f.cm}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
