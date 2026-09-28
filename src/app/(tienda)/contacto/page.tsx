import type { Metadata } from "next";
import { marca } from "@/config/marca";
import { FormContacto } from "./form-contacto";

export const metadata: Metadata = { title: "Contacto", description: `Escríbele a ${marca.nombre}.` };

export default function Contacto() {
  return (
    <div className="contenedor grid max-w-5xl gap-12 py-12 md:grid-cols-[1fr_1.4fr] md:py-20">
      <div>
        <h1 className="titulo-display text-5xl md:text-6xl">Hablemos</h1>
        <p className="mt-6">¿Dudas con tu talla, un pedido o un modelo? Escríbenos y te respondemos en menos de 24 horas hábiles.</p>
        <dl className="mt-10 space-y-5">
          {marca.email && (
            <div>
              <dt className="etiqueta text-cafe/85">Correo</dt>
              <dd className="mt-1">
                <a href={`mailto:${marca.email}`} className="enlace">
                  {marca.email}
                </a>
              </dd>
            </div>
          )}
          {marca.whatsapp && (
            <div>
              <dt className="etiqueta text-cafe/85">WhatsApp</dt>
              <dd className="mt-1">
                <a href={`https://wa.me/${marca.whatsapp}`} className="enlace" target="_blank" rel="noopener noreferrer">
                  Enviar mensaje
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
      <FormContacto />
    </div>
  );
}
