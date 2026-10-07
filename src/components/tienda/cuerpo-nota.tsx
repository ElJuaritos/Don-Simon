type BloqueCuerpo =
  | { tipo: "parrafo"; texto: string }
  | { tipo: "titulo"; texto: string }
  | { tipo: "lista"; items: string[] };

/** Parte el cuerpo en párrafos, subtítulos (##) y listas (guion). Sin Markdown. */
export function partirCuerpo(texto: string): BloqueCuerpo[] {
  const bloques: BloqueCuerpo[] = [];
  let parrafo: string[] = [];
  let lista: string[] = [];

  const cerrarParrafo = () => {
    if (parrafo.length === 0) return;
    bloques.push({ tipo: "parrafo", texto: parrafo.join(" ") });
    parrafo = [];
  };
  const cerrarLista = () => {
    if (lista.length === 0) return;
    bloques.push({ tipo: "lista", items: lista });
    lista = [];
  };

  for (const linea of texto.replace(/\r\n/g, "\n").split("\n")) {
    const limpia = linea.trim();
    if (!limpia) {
      cerrarParrafo();
      cerrarLista();
      continue;
    }
    if (limpia.startsWith("##")) {
      cerrarParrafo();
      cerrarLista();
      const titulo = limpia.replace(/^##\s*/, "");
      if (titulo) bloques.push({ tipo: "titulo", texto: titulo });
      continue;
    }
    if (limpia.startsWith("-")) {
      cerrarParrafo();
      const item = limpia.replace(/^-\s*/, "");
      if (item) lista.push(item);
      continue;
    }
    cerrarLista();
    parrafo.push(limpia);
  }
  cerrarParrafo();
  cerrarLista();
  return bloques;
}

/** Dibuja el cuerpo de una nota. Lo usa la tienda y la vista previa del admin. */
export function CuerpoNota({ texto }: { texto: string }) {
  const bloques = partirCuerpo(texto);
  if (bloques.length === 0) return null;
  return (
    <div className="space-y-4">
      {bloques.map((b, i) => {
        if (b.tipo === "titulo") {
          return (
            <h2 key={i} className="pt-4 text-2xl font-medium">
              {b.texto}
            </h2>
          );
        }
        if (b.tipo === "lista") {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {b.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={i}>{b.texto}</p>;
      })}
    </div>
  );
}
