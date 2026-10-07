import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { codigosPostales } from "@/db/schema";

const UN_DIA = "public, max-age=86400, s-maxage=86400";

/** Un solo código postal. El catálogo completo no se publica. */
export async function GET(_request: Request, ctx: { params: Promise<{ cp: string }> }) {
  const { cp } = await ctx.params;
  if (!/^\d{5}$/.test(cp)) return Response.json({ error: "El código postal debe tener 5 dígitos." }, { status: 400 });

  const db = await getDb();
  const [fila] = await db
    .select({
      estado: codigosPostales.estado,
      municipio: codigosPostales.municipio,
      ciudad: codigosPostales.ciudad,
      colonias: codigosPostales.colonias,
    })
    .from(codigosPostales)
    .where(eq(codigosPostales.cp, cp));

  if (!fila) return new Response(null, { status: 404 });
  return Response.json(fila, { headers: { "Cache-Control": UN_DIA } });
}
