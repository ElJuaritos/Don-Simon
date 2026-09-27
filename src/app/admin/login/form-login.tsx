"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/admin";

export function FormLogin() {
  const [estado, accion, enviando] = useActionState(login, undefined);
  return (
    <form action={accion} className="mt-8 space-y-4">
      <div>
        <label htmlFor="password" className="campo-label">
          Contraseña
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="campo" autoFocus />
      </div>
      {estado?.error && (
        <p role="alert" className="text-sm font-semibold text-terracota-oscuro">
          {estado.error}
        </p>
      )}
      <button type="submit" disabled={enviando} className="btn-primario w-full">
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
