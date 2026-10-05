"use client";

import { eliminarLookbookFoto } from "@/lib/actions/lookbook";

/** Pide confirmación antes de borrar una foto del lookbook. */
export function ConfirmarQuitar({ id }: { id: string }) {
  return (
    <form
      action={eliminarLookbookFoto}
      onSubmit={(e) => {
        if (!confirm("¿Quitas esta foto del lookbook?")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="enlace text-sm">
        Quitar esta foto
      </button>
    </form>
  );
}
