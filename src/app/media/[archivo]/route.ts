import { leerImagen } from "@/lib/storage";

export async function GET(_req: Request, ctx: RouteContext<"/media/[archivo]">) {
  const { archivo } = await ctx.params;
  const img = await leerImagen(archivo);
  if (!img) return new Response("No encontrado", { status: 404 });
  return new Response(new Uint8Array(img.datos), {
    headers: {
      "Content-Type": img.tipo,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
