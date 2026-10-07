"use client";

/** Botón de borrar con una confirmación, para pantallas del admin. */
export function BotonQuitar({
  action,
  id,
  pregunta,
  texto,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  pregunta: string;
  texto: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(pregunta)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="enlace text-sm">
        {texto}
      </button>
    </form>
  );
}
