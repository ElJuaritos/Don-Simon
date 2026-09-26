# CLAUDE.md

Tienda en línea a la medida para **Don Simon**, marca mexicana de calzado de piel premium. Es un sitio público más un panel de administración. Toda la planeación está en [`docs/`](docs/). Léela antes de tomar decisiones de producto o arquitectura.

## Estado

Fase 0 (definición). Todavía no hay código. El siguiente paso acordado con el dueño es un **esqueleto funcional** del sitio y del admin, para que él lo revise y dé retroalimentación ([07-roadmap](docs/07-roadmap.md)).

## Decisiones ya tomadas (no replantear)

- **Todo a la medida, sin Shopify** ni otras plataformas de e-commerce. El dueño lo rechazó por el poco control sobre el diseño.
- **Pagos con Stripe** (Checkout alojado + webhooks). Nunca procesamos ni guardamos datos de tarjeta.
- Stack: **Next.js (App Router) + TypeScript + Tailwind + Supabase (Postgres, Auth, Storage) + Drizzle + Resend, en Vercel** ([05-stack-tecnico](docs/05-stack-tecnico.md)).
- Arrancar en los **planes gratuitos**; el costo bajo es un requisito.
- El nombre se escribe **"Don Simon", sin acento**. Todavía puede cambiar por el conflicto con la marca de bebidas Don Simón ([08](docs/08-decisiones-pendientes.md)), así que el nombre, el dominio y el logo deben ser configurables y no ir escritos a mano por todo el código.

Las decisiones abiertas están en [08-decisiones-pendientes](docs/08-decisiones-pendientes.md). Cuando se resuelva una, actualiza ese archivo y el documento afectado.

## Convenciones

- **Idioma**: todo lo que ve el usuario (textos y URLs) va en español de México, tuteando. Código, nombres de variables y commits pueden ir en inglés, pero las tablas y columnas de la BD siguen el español de [06-modelo-de-datos](docs/06-modelo-de-datos.md).
- **Marca** ([02-identidad-de-marca](docs/02-identidad-de-marca.md)):
  - Colores solo mediante tokens: `cafe #5d3f24`, `crema #e7dac7`, `olivo #9e9268`, `terracota #a85f3e`.
  - Texto de cuerpo solo en café sobre crema o blanco. Blanco sobre terracota está bien. Sobre olivo, solo títulos grandes. Nunca café sobre terracota.
  - Tipografía: *The Seasons* (display, ≥32px) y *Quicksand* (todo lo demás).
  - Esquinas rectas o de radio mínimo, animaciones suaves, sin estética de plantilla.
- **Montos en centavos** (enteros) y en MXN, con IVA incluido.
- **Seguridad en la compra**: el precio y el stock se recalculan en el servidor; un pedido solo pasa a `pagado` por el webhook verificado de Stripe, nunca por la redirección de éxito.
- **Móvil primero** (375px), WCAG 2.1 AA, Lighthouse ≥ 90.
- **Admin**: lo usa el dueño, que no tiene experiencia técnica. Tiene que ser simple, en lenguaje claro y usable desde el celular.
- Secretos solo en `.env.local` y en Vercel. Al repo solo sube `.env.example`.

## Comandos

_Se agregarán cuando exista el proyecto de Next.js._
