"use client";

import { useActionState, useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { iniciarCheckout } from "@/lib/actions/tienda";
import { consultarCp, localidadCp } from "@/lib/cp";
import { formatPrecio } from "@/lib/formato";
import { useCarrito } from "@/components/cart/proveedor-carrito";
import { LogosPago } from "@/components/ui/logos-pago";

const ESTADOS = [
  "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua",
  "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México", "Guanajuato", "Guerrero",
  "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla",
  "Querétaro", "Quintana Roo", "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas",
  "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas",
];

function Campo({
  nombre,
  label,
  className = "",
  ...props
}: { nombre: string; label: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={nombre} className="campo-label">
        {label}
      </label>
      <input id={nombre} name={nombre} className="campo" {...props} />
    </div>
  );
}

function Paso({ n, titulo, children }: { n: number; titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={`paso-${n}`} className="border-t border-negro/10 py-8 first:border-0 first:pt-0">
      <h2 id={`paso-${n}`} className="flex items-center gap-3 font-sans text-lg font-medium">
        <span className="grid h-8 w-8 shrink-0 place-items-center border border-negro text-sm" aria-hidden>
          {n}
        </span>
        {titulo}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** Un solo formulario: contacto, envío (el CP va primero), método y el paso de pago. */
export function FormCheckout({ modoDemo, sinPagos }: { modoDemo: boolean; sinPagos: boolean }) {
  const [estadoForm, accion, enviando] = useActionState(iniciarCheckout, undefined);
  const { carrito } = useCarrito();
  const [cp, setCp] = useState("");
  const [estado, setEstado] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [colonias, setColonias] = useState<string[]>([]);
  const [colonia, setColonia] = useState("");
  const [avisoCp, setAvisoCp] = useState("");
  const pedido = useRef(0);
  const otra = colonia === "__otra";
  const estados = estado && !ESTADOS.includes(estado) ? [estado, ...ESTADOS] : ESTADOS;

  async function alCp(valor: string) {
    const limpio = valor.replace(/\D/g, "").slice(0, 5);
    setCp(limpio);
    if (limpio.length !== 5) {
      setAvisoCp("");
      return;
    }
    const n = ++pedido.current;
    const fila = await consultarCp(limpio);
    if (n !== pedido.current) return;
    if (!fila) {
      setColonias([]);
      setAvisoCp("No encontramos este código postal. Llena el estado, la ciudad y la colonia.");
      return;
    }
    setEstado(fila.estado);
    setCiudad(localidadCp(fila));
    setColonias(fila.colonias);
    setColonia(fila.colonias[0] ?? "");
    setAvisoCp("");
  }

  const metodos = [{ id: "estandar", nombre: "Estándar", detalle: "A todo México", costo: carrito.envio }];

  return (
    <form
      action={accion}
      className="lg:order-1"
      onReset={(e) => e.preventDefault()}
    >
      <Paso n={1} titulo="Contacto">
        <div className="grid gap-4">
          <Campo nombre="email" label="Correo electrónico" type="email" autoComplete="email" required />
          <Campo nombre="telefono" label="Celular" type="tel" autoComplete="tel" inputMode="tel" required placeholder="10 dígitos" />
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="novedades" className="mt-1 accent-negro" />
            Quiero recibir novedades
          </label>
        </div>
      </Paso>

      <Paso n={2} titulo="Envío">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="codigoPostal" className="campo-label">
              Código postal
            </label>
            <input
              id="codigoPostal"
              name="codigoPostal"
              className="campo max-w-[10rem]"
              inputMode="numeric"
              autoComplete="postal-code"
              pattern="\d{5}"
              maxLength={5}
              required
              value={cp}
              onChange={(e) => alCp(e.target.value)}
            />
            {avisoCp && <p className="mt-2 text-sm text-negro/80">{avisoCp}</p>}
          </div>

          <div>
            <label htmlFor="estado" className="campo-label">
              Estado
            </label>
            <select id="estado" name="estado" required autoComplete="address-level1" className="campo" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="" disabled>
                Elige tu estado
              </option>
              {estados.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </div>
          <Campo nombre="ciudad" label="Ciudad o municipio" autoComplete="address-level2" required value={ciudad} onChange={(e) => setCiudad(e.target.value)} />

          <div className="sm:col-span-2">
            <label htmlFor="colonia" className="campo-label">
              Colonia
            </label>
            {colonias.length > 0 ? (
              <>
                <select
                  id="colonia"
                  name={otra ? undefined : "colonia"}
                  required={!otra}
                  className="campo"
                  value={colonia}
                  onChange={(e) => setColonia(e.target.value)}
                >
                  {colonias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                  <option value="__otra">Otra</option>
                </select>
                {otra && (
                  <input
                    name="colonia"
                    required
                    className="campo mt-3"
                    placeholder="Escribe tu colonia"
                    autoComplete="address-level3"
                    aria-label="Escribe tu colonia"
                  />
                )}
              </>
            ) : (
              <input id="colonia" name="colonia" required className="campo" autoComplete="address-level3" />
            )}
          </div>

          <Campo nombre="nombre" label="Nombre" autoComplete="given-name" required />
          <Campo nombre="apellidos" label="Apellidos" autoComplete="family-name" required />
          <Campo nombre="calle" label="Calle" autoComplete="address-line1" required className="sm:col-span-2" />
          <Campo nombre="numeroExt" label="Número exterior" required />
          <Campo nombre="numeroInt" label="Número interior (opcional)" autoComplete="address-line2" />
          <Campo nombre="referencias" label="Referencias (opcional)" placeholder="Entre calles, color de fachada…" className="sm:col-span-2" />
        </div>
      </Paso>

      <Paso n={3} titulo="Método de envío">
        <div className="space-y-3" role="radiogroup" aria-label="Método de envío">
          {metodos.map((m) => (
            <label key={m.id} className="flex cursor-pointer items-center justify-between gap-4 border border-negro/20 px-4 py-3 has-[:checked]:border-negro">
              <span className="flex items-center gap-3">
                <input type="radio" name="metodoEnvio" value={m.id} defaultChecked className="accent-negro" />
                <span>
                  {m.nombre}
                  <span className="mt-0.5 block text-sm text-negro/70">{m.detalle}</span>
                </span>
              </span>
              <span className="text-sm font-medium">{m.costo === 0 ? "Gratis" : formatPrecio(m.costo)}</span>
            </label>
          ))}
        </div>
      </Paso>

      <Paso n={4} titulo="Pago">
        {estadoForm?.error && (
          <p role="alert" className="mb-4 border-l-4 border-pizarra bg-niebla px-4 py-3">
            {estadoForm.error}
          </p>
        )}
        <button type="submit" disabled={enviando || sinPagos} className="btn-primario w-full sm:w-auto">
          {enviando ? "Procesando…" : modoDemo ? "Confirmar pedido" : "Pagar ahora"}
        </button>
        <p className="mt-3 text-sm text-negro/80">
          {modoDemo
            ? "El pedido se registra, pero no se cobra mientras Stripe no esté configurado."
            : "Vas a continuar en la página segura de Stripe. No guardamos los datos de tu tarjeta."}
        </p>
        <LogosPago className="mt-5 text-negro/80" />
      </Paso>
    </form>
  );
}
