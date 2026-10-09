"use client";

import { useState } from "react";
import type { Categoria, Horma, Producto } from "@/db/schema";
import { Campo } from "./campos";

/** Categoría y horma. La horma solo aplica al calzado. */
export function CamposCategoria({
  categorias,
  hormas,
  producto,
}: {
  categorias: Categoria[];
  hormas: Horma[];
  producto?: Producto;
}) {
  const [categoriaId, setCategoriaId] = useState(producto?.categoriaId ?? "");
  const tipo = categorias.find((c) => c.id === categoriaId)?.tipo ?? "calzado";

  return (
    <>
      <Campo label="Categoría">
        <select
          name="categoriaId"
          required
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="campo"
        >
          <option value="" disabled>
            Elige una
          </option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
              {c.tipo === "accesorio" ? " (accesorio)" : ""}
            </option>
          ))}
        </select>
      </Campo>
      {tipo === "calzado" && (
        <Campo label="Horma" ayuda="Define la recomendación de talla que ve el cliente.">
          <select name="hormaId" defaultValue={producto?.hormaId ?? ""} className="campo">
            <option value="">Sin especificar</option>
            {hormas.map((h) => (
              <option key={h.id} value={h.id}>
                {h.nombre} — {h.recomendacion}
              </option>
            ))}
          </select>
        </Campo>
      )}
    </>
  );
}
