# 07 · Roadmap

Las fechas se definen cuando estén resueltas las [decisiones pendientes](08-decisiones-pendientes.md). El contenido (fotos y textos) puede producirse en paralelo desde la fase 0.

## Fase 0 · Definición ← *estamos aquí*
- [x] Brand board (paleta, tipografía, logo, dirección fotográfica)
- [x] Documentación inicial del proyecto
- [x] Plataforma: todo a la medida
- [x] Pasarela de pago: Stripe
- [ ] Logo en vectores (SVG) y licencia web de The Seasons
- [ ] Inventario de productos del lanzamiento (modelos, colores, tallas, precios)

## Fase 1 · Diseño
- [ ] Sistema de diseño: tokens, tipografía, botones, formularios, tarjetas
- [ ] Wireframes móvil y desktop: portada, colección, producto, carrito, checkout
- [ ] Wireframes del admin: productos, pedidos
- [ ] Diseño visual en alta fidelidad de las páginas clave

## Fase 2 · Base técnica
- [ ] Inicializar Next.js + TypeScript + Tailwind con los tokens de marca
- [ ] Proyecto Supabase (desarrollo) y esquema de base de datos con migraciones
- [ ] Datos de prueba (seed) con 3–4 productos
- [ ] Despliegue en Vercel con previews
- [ ] Layout global: header, footer, barra de anuncios, fuentes

## Fase 3 · Catálogo + admin de productos
- [ ] Login del admin
- [ ] Admin: CRUD de productos, variantes, fotos e inventario
- [ ] Portada, colección con filtros y detalle de producto
- [ ] Guía de tallas

## Fase 4 · Compra
- [ ] Carrito (drawer + página)
- [ ] Checkout: datos de contacto y envío, cálculo de envío
- [ ] Integración con Stripe Checkout (modo prueba) + webhook
- [ ] Apartado y descuento de inventario; cancelación de pagos vencidos
- [ ] Correos transaccionales
- [ ] Admin: gestión de pedidos, envíos y reembolsos

## Fase 5 · Contenido y marketing
- [ ] Nuestra historia, ayuda, legales (editables desde el admin)
- [ ] Newsletter, WhatsApp, analítica, SEO (metadatos, sitemap, datos estructurados)

## Fase 6 · Pre-lanzamiento
- [ ] Carga del catálogo real y fotografía final
- [ ] QA: dispositivos, navegadores, accesibilidad, rendimiento
- [ ] Pruebas e2e del flujo de compra
- [ ] Revisión de seguridad (admin, webhooks, validaciones)
- [ ] Supabase y pasarela en modo producción; respaldos
- [ ] Compra real de prueba y reembolso

## Fase 7 · Lanzamiento y después
- [ ] Dominio en producción
- [ ] Monitoreo de errores y conversión
- [ ] Funcionalidades P1: cuentas de cliente, búsqueda, cupones, carritos abandonados, MSI, tablero
