import { readFileSync, existsSync } from "node:fs";
import { sql } from "drizzle-orm";
import { getDb } from "../src/db/index";
import { codigosPostales } from "../src/db/schema";

// Lee el TXT oficial de SEPOMEX (latin1) y carga codigos_postales en la base local.
// El catálogo no se publica ni entra al seed. Hay que detener el servidor: PGlite
// no admite dos procesos. Correrlo otra vez actualiza cada CP sin duplicarlo.

const FUENTE = ".data/sepomex/CPdescarga.txt";
const BLOQUE = 800;

type Registro = { cp: string; estado: string; municipio: string; ciudad: string; colonias: string[] };

function leerSepomex(texto: string) {
  const lineas = texto.split(/\r?\n/);
  const inicio = lineas.findIndex((l) => l.toLowerCase().startsWith("d_codigo|"));
  if (inicio < 0) throw new Error(`No encontré el encabezado d_codigo en ${FUENTE}`);
  const cabecera = lineas[inicio].split("|").map((c) => c.trim().toLowerCase());
  const col = (nombre: string) => {
    const i = cabecera.indexOf(nombre);
    if (i < 0) throw new Error(`No está la columna ${nombre} en ${FUENTE}`);
    return i;
  };
  const iCp = col("d_codigo");
  const iColonia = col("d_asenta");
  const iMunicipio = col("d_mnpio");
  const iEstado = col("d_estado");
  const iCiudad = col("d_ciudad");
  const mapa = new Map<string, Registro>();

  for (const linea of lineas.slice(inicio + 1)) {
    if (!linea.trim()) continue;
    const c = linea.split("|");
    const cp = (c[iCp] ?? "").trim().padStart(5, "0");
    if (!/^\d{5}$/.test(cp)) continue;
    const colonia = (c[iColonia] ?? "").trim();
    const ciudad = (c[iCiudad] ?? "").trim();
    const actual = mapa.get(cp) ?? {
      cp,
      estado: (c[iEstado] ?? "").trim(),
      municipio: (c[iMunicipio] ?? "").trim(),
      ciudad,
      colonias: [],
    };
    if (!actual.ciudad && ciudad) actual.ciudad = ciudad;
    if (colonia && !actual.colonias.includes(colonia)) actual.colonias.push(colonia);
    mapa.set(cp, actual);
  }
  return [...mapa.values()];
}

if (!existsSync(FUENTE)) {
  console.error(`No está ${FUENTE}. Descárgalo de Correos de México y vuelve a correr npm run cp:generar.`);
  process.exit(1);
}

const filas = leerSepomex(readFileSync(FUENTE, "latin1"));
const db = await getDb();

for (let i = 0; i < filas.length; i += BLOQUE) {
  const bloque = filas.slice(i, i + BLOQUE);
  await db
    .insert(codigosPostales)
    .values(bloque)
    .onConflictDoUpdate({
      target: codigosPostales.cp,
      set: {
        estado: sql`excluded.estado`,
        municipio: sql`excluded.municipio`,
        ciudad: sql`excluded.ciudad`,
        colonias: sql`excluded.colonias`,
      },
    });
  console.log(`${Math.min(i + BLOQUE, filas.length)} / ${filas.length}`);
}

console.log(`${filas.length} códigos postales en codigos_postales.`);
process.exit(0);
