import Link from "next/link";
import type { ReactNode } from "react";
import { marca, tienda } from "@/config/marca";
import { formatPrecio } from "@/lib/formato";
import { TablaTallas } from "@/components/product/tabla-tallas";

// Textos provisionales. Las políticas (envíos, cambios, plazos) están pendientes de
// definir con la marca: docs/08-decisiones-pendientes.md (#8, #9).

export type PaginaContenido = { titulo: string; descripcion: string; contenido: ReactNode };

export const paginasAyuda: Record<string, PaginaContenido> = {
  "guia-de-tallas": {
    titulo: "Guía de tallas",
    descripcion: "Encuentra tu talla antes de comprar.",
    contenido: (
      <>
        <h2>Cómo medir tu pie</h2>
        <ul>
          <li>Hazlo por la tarde, cuando el pie está un poco más hinchado.</li>
          <li>Pon una hoja en el piso, pegada a la pared, y apoya el talón contra la pared.</li>
          <li>Marca la punta de tu dedo más largo y mide en centímetros desde la pared.</li>
          <li>Mide ambos pies y usa la medida del más grande.</li>
        </ul>
        <p>La medida en centímetros es tu talla MX. Si quedas entre dos tallas, revisa la recomendación de horma en la página de cada modelo.</p>
        <h2>Tabla de equivalencias</h2>
        <TablaTallas />
        <p className="mt-4">¿Dudas con tu talla? <Link href="/contacto">Escríbenos</Link> y te ayudamos a elegir.</p>
      </>
    ),
  },
  envios: {
    titulo: "Envíos",
    descripcion: "Tiempos y costos de envío a todo México.",
    contenido: (
      <>
        <p>Enviamos a todo México con paquetería rastreable.</p>
        <h2>Costo</h2>
        <p>
          Envío gratis en compras desde {formatPrecio(tienda.envioGratisDesde)}. En compras menores, el envío cuesta{" "}
          {formatPrecio(tienda.costoEnvio)}.
        </p>
        <h2>Tiempos</h2>
        <p>Preparamos tu pedido en 1–2 días hábiles. La entrega toma de 2 a 5 días hábiles según tu ciudad.</p>
        <p>Cuando tu pedido salga, te compartimos el número de guía para rastrearlo.</p>
      </>
    ),
  },
  "cambios-y-devoluciones": {
    titulo: "Cambios y devoluciones",
    descripcion: "Qué hacer si tu par no te queda.",
    contenido: (
      <>
        <p>Queremos que tu par te quede perfecto. Si no es así, te ayudamos.</p>
        <h2>Cambios de talla</h2>
        <p>Puedes solicitar un cambio de talla dentro de los primeros 30 días después de recibir tu pedido, siempre que el calzado no tenga uso y conserve su caja original.</p>
        <h2>Devoluciones</h2>
        <p>Si prefieres una devolución, escríbenos dentro del mismo plazo. Una vez que recibamos y revisemos el producto, hacemos el reembolso al mismo método de pago.</p>
        <h2>Cómo solicitarlo</h2>
        <p>Escríbenos desde <Link href="/contacto">contacto</Link> con tu número de pedido.</p>
      </>
    ),
  },
  "cuidado-del-calzado": {
    titulo: "Cuidado del calzado",
    descripcion: "Para que tu par te dure muchos años.",
    contenido: (
      <>
        <p>La piel es un material vivo: con el cuidado correcto, mejora con el tiempo.</p>
        <h2>Todos los días</h2>
        <ul>
          <li>Deja descansar tus zapatos un día entre cada uso.</li>
          <li>Usa hormas de madera de cedro para conservar la forma y absorber la humedad.</li>
          <li>Usa calzador para no maltratar el talón.</li>
        </ul>
        <h2>Cada 2–3 meses</h2>
        <ul>
          <li>Limpia el polvo con un cepillo de cerda suave.</li>
          <li>Aplica una crema nutritiva del color de la piel o neutra.</li>
          <li>Da brillo con un paño de algodón.</li>
        </ul>
        <h2>Si se mojan</h2>
        <p>Rellénalos con papel y déjalos secar a la sombra, lejos de fuentes de calor.</p>
      </>
    ),
  },
  "preguntas-frecuentes": {
    titulo: "Preguntas frecuentes",
    descripcion: "Respuestas rápidas a las dudas más comunes.",
    contenido: (
      <>
        <h3>¿Cómo sé cuál es mi talla?</h3>
        <p>Revisa nuestra <Link href="/ayuda/guia-de-tallas">guía de tallas</Link> y la recomendación de horma de cada modelo.</p>
        <h3>¿Qué formas de pago aceptan?</h3>
        <p>Tarjetas de crédito y débito. Los pagos se procesan de forma segura con Stripe; nunca guardamos los datos de tu tarjeta.</p>
        <h3>¿Hacen envíos fuera de México?</h3>
        <p>Por ahora solo enviamos dentro de México.</p>
        <h3>¿Puedo cambiar la talla?</h3>
        <p>Sí, revisa nuestra política de <Link href="/ayuda/cambios-y-devoluciones">cambios y devoluciones</Link>.</p>
        <h3>¿Dónde se fabrican?</h3>
        <p>Todos los pares de {marca.nombre} se hacen a mano en México.</p>
      </>
    ),
  },
};

export const paginasLegales: Record<string, PaginaContenido> = {
  "aviso-de-privacidad": {
    titulo: "Aviso de privacidad",
    descripcion: "Cómo tratamos tus datos personales.",
    contenido: (
      <>
        <p className="border-l-4 border-terracota bg-crema px-4 py-3">
          <strong>Borrador.</strong> Este texto es un marcador de posición y debe redactarlo o revisarlo un abogado conforme a la LFPDPPP antes del lanzamiento.
        </p>
        <h2>Responsable</h2>
        <p>{marca.nombre} es responsable del tratamiento de tus datos personales.</p>
        <h2>Datos que recabamos</h2>
        <p>Nombre, correo electrónico, teléfono y dirección de envío, con el fin de procesar y entregar tus pedidos y, si lo autorizas, enviarte comunicaciones.</p>
        <h2>Pagos</h2>
        <p>Los pagos los procesa Stripe. No almacenamos datos de tarjetas.</p>
        <h2>Derechos ARCO</h2>
        <p>Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición escribiendo a {marca.email}.</p>
      </>
    ),
  },
  "terminos-y-condiciones": {
    titulo: "Términos y condiciones",
    descripcion: "Condiciones de uso y compra.",
    contenido: (
      <>
        <p className="border-l-4 border-terracota bg-crema px-4 py-3">
          <strong>Borrador.</strong> Este texto es un marcador de posición y debe redactarlo o revisarlo un abogado antes del lanzamiento.
        </p>
        <h2>Precios</h2>
        <p>Todos los precios están en pesos mexicanos (MXN) e incluyen IVA.</p>
        <h2>Pedidos</h2>
        <p>Un pedido se confirma cuando recibimos el pago. Nos reservamos el derecho de cancelar pedidos por falta de inventario, en cuyo caso reembolsamos el total.</p>
        <h2>Envíos, cambios y devoluciones</h2>
        <p>Consulta <Link href="/ayuda/envios">envíos</Link> y <Link href="/ayuda/cambios-y-devoluciones">cambios y devoluciones</Link>.</p>
      </>
    ),
  },
};
