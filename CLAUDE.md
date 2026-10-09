# CLAUDE.md

Tienda en línea a la medida para **Varen**, marca mexicana de calzado de piel premium. Es un sitio público más un panel de administración. Toda la planeación está en [`docs/`](docs/). Léela antes de tomar decisiones de producto o arquitectura.

## Estado

MVP funcional en local, con el rediseño editorial pedido por el dueño (referencias en su PDF de estilo visual: minimalismo cálido, el producto como protagonista, cuadros de imagen y texto). Todavía no es para producción ([07-roadmap](docs/07-roadmap.md)). Lo que falta está marcado con `TODO` en el código y en el roadmap: correos con Resend, Supabase Storage, Supabase Auth, fotos y logo reales.

## Arquitectura

- `src/app/(tienda)/`: sitio público. `src/app/admin/`: panel, con `login/` fuera del grupo protegido `(panel)/`.
- `src/db/`: esquema de Drizzle, conexión y datos de ejemplo. Sin `DATABASE_URL` se usa **PGlite** en `.data/pglite`, con migraciones y seed automáticos al arrancar.
- **Supabase** (`dqvmxpdzwsainzgfpowm`): ya tiene el esquema y los datos de ejemplo. Todas las tablas llevan RLS sin políticas (`.enableRLS()` en el esquema): la app entra por la conexión directa de Postgres y la API REST pública no expone nada. Las tablas nuevas también deben llevar `.enableRLS()`. Drizzle registra las migraciones en `drizzle.__drizzle_migrations`, así que `npm run db:migrar` solo aplica las nuevas. **Por ahora no se toca Supabase** (el nombre ya es Varen; se retoma cuando se decida): tiene hasta la migración `0002`; las del rediseño (`0003` en adelante) solo están en la base local.
- `src/lib/data/`: consultas. `src/lib/actions/`: Server Actions. `tienda.ts` es público y `admin.ts` empieza cada acción con `requireAdmin()`.
- `src/lib/carrito.ts`: el carrito vive en una cookie que solo guarda IDs y cantidades.
- **Inventario**: al crear un pedido se aparta el stock (`stock_apartado`). El webhook de Stripe lo descuenta al confirmarse el pago y lo libera si el pago vence o falla. Ver `src/lib/data/pedidos.ts`.
- `src/lib/storage.ts`: en local, las imágenes se guardan en `.data/uploads` y se sirven en `/media/*`.
- `src/config/marca.ts`: nombre, contacto, costos de envío y anuncio. Los datos de contacto vacíos no se muestran.
- **Contenido editable**: cada cuadro de la portada y de Nuestra historia está definido en `src/content/bloques.ts` (campos, proporción de foto y textos por defecto). El dueño lo edita en `/admin/contenido` y se guarda en la tabla `bloques`. Si no hay fila, se usa el texto por defecto. Ver `src/lib/data/contenido.ts` y `src/lib/actions/contenido.ts`.
- **Hombre / Mujer**: `productos.publico` (`hombre`, `mujer`, `unisex`). `/coleccion?para=mujer` muestra los de mujer y los unisex.
- Las hormas (`/nuestras-hormas`) y las fotos de categorías se editan en `/admin/hormas` y `/admin/categorias`.
- Componentes de la portada en `src/components/portada/`. Enlaces de navegación en `src/components/layout/navegacion.ts`.
- Next.js 16: se usa `proxy.ts` (antes llamado middleware), y `params`, `searchParams` y `cookies()` son asíncronos. Antes de usar una API, consulta `node_modules/next/dist/docs/`.

## Decisiones ya tomadas (no replantear)

- **Todo a la medida, sin Shopify** ni otras plataformas de e-commerce. El dueño lo rechazó por el poco control sobre el diseño.
- **Pagos con Stripe** (Checkout alojado + webhooks). Nunca procesamos ni guardamos datos de tarjeta. El dueño pidió también **PayPal** y **meses sin intereses en promociones**; Stripe no procesa PayPal en México, así que la forma de integrarlo está pendiente ([09](docs/09-plan-rediseno-mockups.md) §14.3).
- Stack: **Next.js (App Router) + TypeScript + Tailwind + Supabase (Postgres, Auth, Storage) + Drizzle + Resend, en Cloudflare Workers** con OpenNext, en el plan gratuito. Se muda a Vercel cuando la tienda crezca ([05-stack-tecnico](docs/05-stack-tecnico.md), [08 #11b](docs/08-decisiones-pendientes.md)).
- Arrancar en los **planes gratuitos**; el costo bajo es un requisito.
- El nombre es **Varen** (antes "Don Simon", por el conflicto con la marca de bebidas Don Simón; el historial sigue en [08](docs/08-decisiones-pendientes.md) #0). En el código se usa `marca.nombre`. El dominio (`marca.dominio`) está vacío hasta que se elija y no se muestra.

Las decisiones abiertas están en [08-decisiones-pendientes](docs/08-decisiones-pendientes.md). Cuando se resuelva una, actualiza ese archivo y el documento afectado.

## Convenciones

- **Idioma**: todo lo que ve el usuario (textos y URLs) va en español de México, tuteando. Código, nombres de variables y commits pueden ir en inglés, pero las tablas y columnas de la BD siguen el español de [06-modelo-de-datos](docs/06-modelo-de-datos.md).
- **Marca** ([02-identidad-de-marca](docs/02-identidad-de-marca.md)):
  - Colores solo mediante tokens: `blanco #ffffff`, `niebla #f2f0f0`, `topo #aa9d92`, `pizarra #3d516b`, `pizarra-oscuro #2e3d52`, `negro #000000`.
  - Sobre topo solo texto negro. Sobre pizarra solo texto blanco. El texto secundario es negro al 70 % y no baja de 60 %. No hay texto topo.
  - Tipografía provisional: Montserrat en todo el texto y Cormorant Garamond, sin cursiva, en títulos de 32 px o más.
  - Esquinas rectas o de radio mínimo, animaciones suaves, sin estética de plantilla.
- **Montos en centavos** (enteros) y en MXN, con IVA incluido.
- **Seguridad en la compra**: el precio y el stock se recalculan en el servidor; un pedido solo pasa a `pagado` por el webhook verificado de Stripe, nunca por la redirección de éxito.
- **Móvil primero** (375px), WCAG 2.1 AA, Lighthouse ≥ 90.
- **Admin**: lo usa el dueño, que no tiene experiencia técnica. Tiene que ser simple, en lenguaje claro y usable desde el celular.
- Secretos solo en `.env.local` y en Cloudflare. Al repo solo sube `.env.example`.

## Comandos

- `npm run dev`: servidor de desarrollo. También existe la configuración `don-simon` en `.claude/launch.json`.
- `npm run typecheck && npm run lint && npm run build`: correr antes de hacer commit.
- `npm run db:generar`: después de cambiar `src/db/schema.ts`, genera la migración en `drizzle/`.
- `npm run db:reiniciar`: borra la base local. Detén el servidor antes, porque PGlite no admite dos procesos abiertos a la vez. Las migraciones nuevas se aplican solas, pero el seed solo corre en una base vacía: reinicia si cambias `src/db/seed.ts`.
- `npm run db:fotos`: asigna las fotos de ejemplo (generadas con IA, en `.data/fotos-ejemplo`) a la portada, historia, categorías, hormas y productos. Con el servidor detenido. Se reemplazan desde el admin cuando lleguen las fotos reales.
- `npm run cp:generar`: lee `.data/sepomex/CPdescarga.txt` (latin1) y carga la tabla `codigos_postales` en la base local, en bloques. Con el servidor detenido. Se puede correr otra vez sin duplicar. El catálogo no va al repositorio ni al seed.
- `npm run db:resenas-ejemplo`: carga unas reseñas publicadas de prueba en la base local, para ver el diseño. Con el servidor detenido. `--borrar` las quita. No corre si hay `DATABASE_URL` y no forma parte del seed.

@AGENTS.md
