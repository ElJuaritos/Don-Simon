# 05 · Stack técnico

> **Decisión (2026-09-25):** el proyecto se construye **todo a la medida**, sin plataformas de e-commerce como Shopify. Nosotros desarrollamos la tienda, el catálogo, el inventario, los pedidos y el panel de administración. Los cobros se hacen con una pasarela de pago externa, porque los datos de tarjeta nunca deben pasar por nuestro servidor.

## Qué construimos y qué contratamos

| Pieza | Lo construimos | Servicio externo |
|-------|:-:|---|
| Sitio público (diseño, páginas, catálogo) | ✅ | |
| Carrito y checkout | ✅ | |
| Inventario, pedidos, clientes | ✅ | |
| Panel de administración | ✅ | |
| Cobro con tarjeta, OXXO, SPEI, MSI | | **Stripe** |
| Base de datos, archivos, autenticación | | Supabase |
| Envío de correos | | Resend |
| Hosting | | Vercel |
| Guías de paquetería | | Envia.com / Skydropx (fase 2) |
| Facturación CFDI | | Facturama o similar (fase 2) |

## Stack

| Capa | Tecnología | Por qué |
|------|------------|---------|
| Framework | **Next.js** (App Router) + **TypeScript** | Un solo proyecto para el sitio público, el API y el admin; buen SEO |
| Estilos | **Tailwind CSS** con los tokens de marca | Consistencia con la paleta y la tipografía |
| Componentes accesibles | Radix UI | Modales, acordeones y drawers accesibles, con nuestro propio estilo |
| Animación | Motion | Transiciones suaves |
| Base de datos | **PostgreSQL en Supabase** | Relacional (ideal para productos, variantes y pedidos); plan gratuito para empezar |
| ORM | **Drizzle** | Tipos de TypeScript generados a partir del esquema; migraciones versionadas |
| Autenticación | Supabase Auth | Login del admin (y de clientes en la fase 2) |
| Imágenes | Supabase Storage + `next/image` | Fotos de producto optimizadas a AVIF/WebP |
| Pagos | **Stripe** (Checkout alojado + webhooks) | Tarjetas, OXXO, SPEI y MSI en México; nunca tocamos datos de tarjeta |
| Correos | **Resend** + React Email | Confirmación de pedido, envío, contacto |
| Validación | Zod | Formularios y API |
| Hosting | **Vercel** | Despliegue automático desde GitHub y previews por rama |
| Analítica | GA4 + Meta Pixel | |
| Pruebas | Vitest (lógica) + Playwright (flujo de compra) | |

## Flujo de compra

```
Cliente            Nuestro sitio (Next.js)              Stripe
  │  agrega al carrito  │                                     │
  │────────────────────▶│  carrito en cookie + BD             │
  │  checkout: datos    │                                     │
  │  de envío           │  valida stock y precio en el        │
  │────────────────────▶│  servidor; crea Pedido "pendiente"  │
  │                     │  y aparta el inventario             │
  │                     │────── crea sesión de pago ─────────▶│
  │◀──────── redirige a la página de pago segura ─────────────│
  │  paga (tarjeta / OXXO / SPEI)                             │
  │──────────────────────────────────────────────────────────▶│
  │                     │◀──── webhook "pago aprobado" ───────│
  │                     │  Pedido → "pagado"; descuenta stock │
  │                     │  y envía correo de confirmación     │
  │◀── página "Gracias" │                                     │
```

Reglas importantes:
- **El precio y el stock se calculan siempre en el servidor**, nunca con lo que manda el navegador.
- **El pedido se marca como pagado solo con el webhook** verificado de la pasarela, nunca con la redirección de "éxito".
- Pagos en OXXO/SPEI: el pedido queda "esperando pago" hasta que llega el webhook; si vence, se cancela y se libera el inventario.

## Estructura del repositorio

```
don-simon/
├── docs/
├── public/                      Favicon, fuentes
├── src/
│   ├── app/
│   │   ├── (tienda)/            portada, coleccion, producto, carrito, checkout, buscar
│   │   ├── (marca)/             nuestra-historia
│   │   ├── ayuda/
│   │   ├── legal/
│   │   ├── admin/               Panel de administración (protegido)
│   │   │   ├── productos/
│   │   │   ├── inventario/
│   │   │   ├── pedidos/
│   │   │   └── contenido/
│   │   └── api/
│   │       └── webhooks/pagos/  Confirmación de la pasarela
│   ├── components/
│   │   ├── ui/                  Botón, Input, Acordeón, Drawer, Modal…
│   │   ├── layout/              Header, Footer, AnnouncementBar
│   │   ├── product/             ProductCard, Gallery, VariantSelector, SizeGuide
│   │   ├── cart/
│   │   └── admin/
│   ├── db/
│   │   ├── schema.ts            Esquema Drizzle (ver doc 06)
│   │   ├── migrations/
│   │   └── seed.ts              Datos de prueba
│   ├── lib/
│   │   ├── payments/            Integración con la pasarela
│   │   ├── email/               Plantillas de correo
│   │   └── auth/
│   └── styles/
├── tests/
├── .env.example
└── README.md
```

## Entornos

| Entorno | Rama | Base de datos | Pagos |
|---------|------|---------------|-------|
| Desarrollo | local | Proyecto Supabase de desarrollo | Modo prueba |
| Preview | cualquier PR | Proyecto Supabase de desarrollo | Modo prueba |
| Producción | `main` | Proyecto Supabase de producción | Modo real |

Los secretos (llaves de la pasarela, de Supabase y de Resend) viven en Vercel y en un `.env.local` que no se sube al repositorio. En el repo solo va `.env.example` con los nombres de las variables.

## Costos estimados al arrancar

| Servicio | Costo |
|----------|-------|
| Vercel | Gratis (Hobby) → US$20/mes (Pro, cuando haya ventas) |
| Supabase | Gratis → US$25/mes (Pro, recomendado para producción por los respaldos diarios) |
| Resend | Gratis hasta 3,000 correos/mes |
| Stripe | Sin mensualidad; comisión por transacción (~3.6% + fijo) |
| Dominio | ~US$15–40/año |
