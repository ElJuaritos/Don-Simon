import Image from "next/image";
import { marca } from "@/config/marca";

const VARIANTES = {
  claro: { src: "/marca/varen-negro.png", width: 1938, height: 543 },
  oscuro: { src: "/marca/varen-blanco.png", width: 1832, height: 450 },
} as const;

/** Logotipo. `oscuro` es la versión blanca, para la barra negra y el footer. */
export function Logo({
  tono = "claro",
  className = "",
  priority = false,
}: {
  tono?: keyof typeof VARIANTES;
  className?: string;
  priority?: boolean;
}) {
  const v = VARIANTES[tono];
  return (
    <Image
      src={v.src}
      alt={marca.nombre}
      width={v.width}
      height={v.height}
      priority={priority}
      sizes="180px"
      className={`h-7 w-auto lg:h-8 ${className}`}
    />
  );
}
