"use client";

import { useActionState } from "react";
import { iniciarCheckout } from "@/lib/actions/tienda";

const ESTADOS_MX = [
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
}: { nombre: string; label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor={nombre} className="campo-label">
        {label}
      </label>
      <input id={nombre} name={nombre} className="campo" {...props} />
    </div>
  );
}

export function FormCheckout() {
  const [estado, accion, enviando] = useActionState(iniciarCheckout, undefined);

  return (
    <form action={accion} className="space-y-10">
      <fieldset className="grid gap-4 sm:grid-cols-2">
        <legend className="etiqueta mb-4">Contacto</legend>
        <Campo nombre="email" label="Correo electrónico" type="email" autoComplete="email" required className="sm:col-span-2" />
        <Campo nombre="nombre" label="Nombre completo" autoComplete="name" required />
        <Campo nombre="telefono" label="Teléfono" type="tel" autoComplete="tel" inputMode="tel" required placeholder="10 dígitos" />
      </fieldset>

      <fieldset className="grid gap-4 sm:grid-cols-6">
        <legend className="etiqueta mb-4">Dirección de envío</legend>
        <Campo nombre="calle" label="Calle" autoComplete="address-line1" required className="sm:col-span-6" />
        <Campo nombre="numeroExt" label="Núm. exterior" required className="sm:col-span-3" />
        <Campo nombre="numeroInt" label="Núm. interior (opcional)" className="sm:col-span-3" />
        <Campo nombre="colonia" label="Colonia" required className="sm:col-span-4" />
        <Campo nombre="codigoPostal" label="Código postal" autoComplete="postal-code" inputMode="numeric" pattern="\d{5}" maxLength={5} required className="sm:col-span-2" />
        <Campo nombre="ciudad" label="Ciudad o municipio" autoComplete="address-level2" required className="sm:col-span-3" />
        <div className="sm:col-span-3">
          <label htmlFor="estado" className="campo-label">
            Estado
          </label>
          <select id="estado" name="estado" required defaultValue="" autoComplete="address-level1" className="campo">
            <option value="" disabled>
              Elige tu estado
            </option>
            {ESTADOS_MX.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>
        <Campo nombre="referencias" label="Referencias (opcional)" placeholder="Entre calles, color de fachada…" className="sm:col-span-6" />
      </fieldset>

      <div>
        <label htmlFor="notas" className="campo-label">
          Notas del pedido (opcional)
        </label>
        <textarea id="notas" name="notas" rows={3} className="campo" placeholder="¿Es un regalo? Cuéntanos." />
      </div>

      {estado?.error && (
        <p role="alert" className="border-l-4 border-terracota bg-crema px-4 py-3">
          {estado.error}
        </p>
      )}

      <div>
        <button type="submit" disabled={enviando} className="btn-primario w-full sm:w-auto">
          {enviando ? "Procesando…" : "Ir a pagar"}
        </button>
        <p className="mt-3 text-sm text-cafe/85">
          Serás redirigido a la página segura de Stripe para completar tu pago. No guardamos los datos de tu tarjeta.
        </p>
      </div>
    </form>
  );
}
