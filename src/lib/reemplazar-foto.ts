import { borrarImagen, guardarImagen } from "@/lib/storage";

function archivoDe(formData: FormData, campo: string) {
  const a = formData.get(campo);
  return a instanceof File && a.size > 0 ? a : null;
}

/**
 * Sube la foto nueva o quita la actual, y borra el archivo anterior.
 * Devuelve undefined si la foto no cambia.
 */
export async function reemplazarFoto(formData: FormData, anterior: string | null | undefined) {
  const nuevo = archivoDe(formData, "archivo");
  if (nuevo) {
    const url = await guardarImagen(nuevo);
    if (anterior) await borrarImagen(anterior);
    return url;
  }
  if (formData.get("quitarImagen") === "on") {
    if (anterior) await borrarImagen(anterior);
    return null;
  }
  return undefined;
}
