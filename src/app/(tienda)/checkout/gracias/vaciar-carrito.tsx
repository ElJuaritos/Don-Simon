"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { limpiarCarrito } from "@/lib/actions/tienda";

/** Vacía el carrito al volver de Stripe (las cookies solo se pueden borrar desde una Server Action). */
export function VaciarCarrito() {
  const router = useRouter();
  useEffect(() => {
    limpiarCarrito().then(() => router.refresh());
  }, [router]);
  return null;
}
