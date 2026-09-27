import { mkdirSync } from "node:fs";
import path from "node:path";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";
import { seed } from "./seed";

// Con DATABASE_URL (Supabase / Postgres) se conecta a ese servidor.
// Sin DATABASE_URL usa PGlite: un Postgres embebido que guarda los datos en
// .data/pglite, así el proyecto corre en local sin instalar nada. La primera vez
// aplica las migraciones y carga datos de ejemplo.

// Ambos drivers exponen la misma API de Drizzle para Postgres.
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

async function crearDb(): Promise<Db> {
  if (process.env.DATABASE_URL) {
    const { drizzle } = await import("drizzle-orm/postgres-js");
    const postgres = (await import("postgres")).default;
    const client = postgres(process.env.DATABASE_URL, { prepare: false });
    return drizzle(client, { schema });
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const { drizzle } = await import("drizzle-orm/pglite");
  const { migrate } = await import("drizzle-orm/pglite/migrator");
  const carpeta = path.join(process.cwd(), ".data", "pglite");
  mkdirSync(carpeta, { recursive: true });
  const client = new PGlite(carpeta);
  const db = drizzle(client, { schema });
  await migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  await seed(db);
  return db;
}

const globalForDb = globalThis as unknown as { __dbPromise?: Promise<Db> };

export function getDb(): Promise<Db> {
  globalForDb.__dbPromise ??= crearDb().catch((e) => {
    // No dejar el error en caché: el siguiente request lo vuelve a intentar
    globalForDb.__dbPromise = undefined;
    throw e;
  });
  return globalForDb.__dbPromise;
}

export { schema };
