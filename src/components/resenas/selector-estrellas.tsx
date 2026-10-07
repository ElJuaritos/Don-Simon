"use client";

import { useState } from "react";
import { IconoEstrella } from "./estrellas";

/** Radios 1–5. Al elegir una, se marcan también las anteriores. */
export function SelectorEstrellas() {
  const [valor, setValor] = useState(0);
  return (
    <fieldset>
      <legend className="campo-label">Calificación</legend>
      <div role="radiogroup" aria-label="Calificación, de 1 a 5 estrellas" className="mt-1 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <label
            key={n}
            className={`grid h-11 w-11 cursor-pointer place-items-center ${n <= valor ? "text-terracota" : "text-cafe/25"}`}
          >
            <input
              type="radio"
              name="calificacion"
              value={n}
              required
              checked={valor === n}
              onChange={() => setValor(n)}
              className="sr-only"
            />
            <span className="sr-only">
              {n} {n === 1 ? "estrella" : "estrellas"}
            </span>
            <IconoEstrella className="h-6 w-6" />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
