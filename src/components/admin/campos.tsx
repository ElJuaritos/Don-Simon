import Image from "next/image";
import type { ReactNode } from "react";

// Campos de formulario del admin, con textos de ayuda en lenguaje claro.

export function Campo({ label, ayuda, children }: { label: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="campo-label">{label}</span>
      {children}
      {ayuda && <span className="mt-1 block text-xs text-cafe/85">{ayuda}</span>}
    </label>
  );
}

/** Vista previa de la foto actual + selector para cambiarla o quitarla. */
export function CampoFoto({
  actual,
  alt = "",
  proporcion,
  nota,
  id,
}: {
  actual: string | null | undefined;
  alt?: string;
  proporcion?: string;
  nota?: string;
  id: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-[9rem_1fr] sm:items-start">
      <div className="relative aspect-[4/5] w-36 overflow-hidden border border-cafe/15 bg-arena">
        {actual ? (
          <Image src={actual} alt={alt} fill sizes="144px" className="object-cover" />
        ) : (
          <p className="grid h-full place-items-center p-3 text-center text-xs text-cafe/85">
            Sin foto{nota ? `: ${nota}` : ""}
          </p>
        )}
      </div>
      <div className="space-y-3">
        <label className="block" htmlFor={`archivo-${id}`}>
          <span className="campo-label">{actual ? "Cambiar foto" : "Subir foto"}</span>
          <input
            id={`archivo-${id}`}
            name="archivo"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="campo py-2.5"
          />
          <span className="mt-1 block text-xs text-cafe/85">
            JPG, PNG o WebP de hasta 8 MB.{proporcion ? ` Recomendado: ${proporcion}.` : ""}
          </span>
        </label>
        {actual && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="quitarImagen" className="h-4 w-4 accent-cafe" />
            Quitar la foto actual
          </label>
        )}
      </div>
    </div>
  );
}
