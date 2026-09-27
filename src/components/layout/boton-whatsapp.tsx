import { marca } from "@/config/marca";
import { IconoWhatsapp } from "@/components/ui/iconos";

export function BotonWhatsapp() {
  if (!marca.whatsapp) return null;
  const texto = encodeURIComponent(`Hola, tengo una pregunta sobre ${marca.nombre}.`);
  return (
    <a
      href={`https://wa.me/${marca.whatsapp}?text=${texto}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-cafe text-crema-claro shadow-lg transition-transform hover:scale-105"
    >
      <IconoWhatsapp width={26} height={26} />
    </a>
  );
}
