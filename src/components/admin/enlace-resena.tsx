"use client";

import { useState } from "react";
import { marca } from "@/config/marca";

function telefonoWa(telefono: string) {
  const d = telefono.replace(/\D/g, "");
  if (d.length === 10) return `52${d}`;
  return d;
}

/** Copiar el enlace de reseña o abrirlo en WhatsApp con un mensaje ya escrito. */
export function EnlaceResena({
  url,
  nombre,
  producto,
  telefono,
}: {
  url: string;
  nombre: string;
  producto: string;
  telefono: string;
}) {
  const [copiado, setCopiado] = useState(false);
  const numero = telefonoWa(telefono);
  const texto = `Hola ${nombre.split(" ")[0] || nombre}, gracias por tu compra en ${marca.nombre}. ¿Cómo te quedó tu ${producto}? Cuéntanos aquí: ${url}`;

  return (
    <div className="mt-3 grid gap-2">
      <input readOnly value={url} className="campo text-sm" aria-label="Enlace para pedir la reseña" onFocus={(e) => e.currentTarget.select()} />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-primario"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setCopiado(true);
            } catch {
              setCopiado(false);
            }
          }}
        >
          {copiado ? "Enlace copiado" : "Copiar enlace"}
        </button>
        {numero && (
          <a className="btn-contorno" href={`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`} target="_blank" rel="noopener noreferrer">
            Enviar por WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
