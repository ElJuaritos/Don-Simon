// Aplica migraciones y datos de ejemplo en una base Postgres remota (Supabase).
// Uso: DATABASE_URL=... npm run db:migrar
// En local (sin DATABASE_URL) no hace falta: la app lo hace sola al arrancar.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "../src/db/schema";
import { seed } from "../src/db/seed";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("Falta DATABASE_URL");
  process.exit(1);
}

const client = postgres(url, { max: 1, prepare: false });
const db = drizzle(client, { schema });

await migrate(db, { migrationsFolder: "drizzle" });
console.log("✓ Migraciones aplicadas");
if (process.argv.includes("--seed")) {
  await seed(db);
  console.log("✓ Datos de ejemplo cargados (si la base estaba vacía)");
}
await client.end();
