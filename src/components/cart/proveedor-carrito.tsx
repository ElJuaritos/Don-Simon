"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useOptimistic, useState, useTransition, type ReactNode } from "react";
import { tienda } from "@/config/marca";
import { cambiarCantidad } from "@/lib/actions/tienda";
import type { CarritoDetallado, LineaCarrito } from "@/lib/carrito";

type Abrir = { carrito?: CarritoDetallado; agregadoId?: string; desde?: HTMLElement | null };

type Ctx = {
  carrito: CarritoDetallado;
  abierto: boolean;
  agregadoId?: string;
  abrir: (opciones?: Abrir) => void;
  cerrar: () => void;
  fijarCantidad: (varianteId: string, cantidad: number) => void;
  pendiente: boolean;
};

const CarritoCtx = createContext<Ctx | null>(null);

export function useCarrito() {
  const ctx = useContext(CarritoCtx);
  if (!ctx) throw new Error("useCarrito se usa dentro de ProveedorCarrito");
  return ctx;
}

function resumir(lineas: LineaCarrito[]): CarritoDetallado {
  const subtotal = lineas.reduce((s, l) => s + l.precioUnitario * l.cantidad, 0);
  const envio = subtotal === 0 ? 0 : subtotal >= tienda.envioGratisDesde ? 0 : tienda.costoEnvio;
  return {
    lineas,
    subtotal,
    envio,
    total: subtotal + envio,
    cantidad: lineas.reduce((s, l) => s + l.cantidad, 0),
    faltaParaEnvioGratis: Math.max(0, tienda.envioGratisDesde - subtotal),
    hayProblemasDeStock: lineas.some((l) => l.cantidad > l.disponibles),
  };
}

function reducir(actual: CarritoDetallado, accion: { varianteId: string; cantidad: number }): CarritoDetallado {
  const lineas =
    accion.cantidad <= 0
      ? actual.lineas.filter((l) => l.varianteId !== accion.varianteId)
      : actual.lineas.map((l) => (l.varianteId === accion.varianteId ? { ...l, cantidad: accion.cantidad } : l));
  return resumir(lineas);
}

/** Estado del panel lateral, compartido por el header y la ficha. */
export function ProveedorCarrito({ carrito, children }: { carrito: CarritoDetallado; children: ReactNode }) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [agregadoId, setAgregadoId] = useState<string | undefined>();
  const [extra, setExtra] = useState<CarritoDetallado | null>(null);
  const [visto, setVisto] = useState(carrito);
  const [pendiente, iniciar] = useTransition();

  if (carrito !== visto) {
    setVisto(carrito);
    setExtra(null);
  }

  const base = extra ?? carrito;
  const [optimista, aplicar] = useOptimistic(base, reducir);

  const abrir = useCallback((opciones?: Abrir) => {
    opciones?.desde?.focus();
    if (opciones?.carrito) setExtra(opciones.carrito);
    setAgregadoId(opciones?.agregadoId);
    setAbierto(true);
  }, []);

  const cerrar = useCallback(() => setAbierto(false), []);

  const fijarCantidad = useCallback(
    (varianteId: string, cantidad: number) => {
      iniciar(async () => {
        aplicar({ varianteId, cantidad });
        const datos = new FormData();
        datos.set("varianteId", varianteId);
        datos.set("cantidad", String(cantidad));
        await cambiarCantidad(datos);
        router.refresh();
      });
    },
    [aplicar, router],
  );

  return (
    <CarritoCtx.Provider value={{ carrito: optimista, abierto, agregadoId, abrir, cerrar, fijarCantidad, pendiente }}>
      {children}
    </CarritoCtx.Provider>
  );
}
