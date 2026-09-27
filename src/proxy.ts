import { NextResponse, type NextRequest } from "next/server";

// Revisión rápida: sin cookie de sesión, al login. La verificación real de la firma
// se hace en el layout del admin y en cada Server Action (requireAdmin).
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  if (!request.cookies.has("ds_admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
