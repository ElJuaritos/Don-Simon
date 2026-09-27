# Don Simon

Sitio web oficial y tienda en línea de **Don Simon** (Est. 2026), marca de calzado artesanal de piel.

El sitio tiene dos objetivos: **contar la historia de la marca** (oficio, materiales, origen) y **vender el calzado en línea**.

Referencias de la industria: [Dante Shoes](https://www.danteshoes.com/) y [Duque](https://duque.mx/).

## Documentación

| # | Documento | Contenido |
|---|-----------|-----------|
| 01 | [Visión y alcance](docs/01-vision-y-alcance.md) | Objetivos, público, alcance del MVP y lo que queda fuera |
| 02 | [Identidad de marca](docs/02-identidad-de-marca.md) | Logo, paleta, tipografía, fotografía, tono de voz |
| 03 | [Arquitectura de información](docs/03-arquitectura-de-informacion.md) | Mapa del sitio, navegación y contenido de cada página |
| 04 | [Funcionalidades](docs/04-funcionalidades.md) | Requerimientos funcionales por fase |
| 05 | [Stack técnico](docs/05-stack-tecnico.md) | Tecnologías propuestas y estructura del repositorio |
| 06 | [Modelo de datos](docs/06-modelo-de-datos.md) | Entidades del catálogo, pedidos y clientes |
| 07 | [Roadmap](docs/07-roadmap.md) | Fases de trabajo y entregables |
| 08 | [Decisiones pendientes](docs/08-decisiones-pendientes.md) | Preguntas abiertas que bloquean o afectan el desarrollo |

## Correr el proyecto en local

Requisitos: Node.js 20.9 o superior.

```bash
npm install
cp .env.example .env.local   # y llena ADMIN_PASSWORD y SESSION_SECRET
npm run dev
```

- Tienda: http://localhost:3000
- Panel de administración: http://localhost:3000/admin (contraseña: `ADMIN_PASSWORD` de `.env.local`)

No hace falta instalar ninguna base de datos. Sin `DATABASE_URL`, el proyecto usa **PGlite**, un Postgres embebido que guarda los datos en `.data/pglite` y carga 6 productos de ejemplo la primera vez. Para empezar de cero: `npm run db:reiniciar`.

Sin llaves de Stripe, el checkout funciona en **modo demo**: registra el pedido pero no cobra.

| Comando | Qué hace |
|---------|----------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run typecheck` / `npm run lint` | Revisión de tipos y estilo |
| `npm run db:generar` | Genera una migración después de cambiar `src/db/schema.ts` |
| `npm run db:migrar -- --seed` | Aplica migraciones (y datos de ejemplo) en Supabase, con `DATABASE_URL` |
| `npm run db:reiniciar` | Borra la base local |

## Estado

🧱 Esqueleto funcional (sitio + admin) listo para que el dueño lo revise. Ver [roadmap](docs/07-roadmap.md).
