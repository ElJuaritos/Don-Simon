import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";
import { NavAdmin } from "@/components/admin/nav-admin";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel" },
  robots: { index: false },
};

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="flex min-h-dvh flex-col bg-white md:flex-row">
      <aside className="border-b border-cafe/10 bg-crema-claro md:sticky md:top-0 md:h-dvh md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4 md:block md:py-8">
          <Link href="/admin" className="text-3xl">
            <Logo />
          </Link>
          <p className="etiqueta text-cafe/85 max-md:hidden md:mt-1">Panel</p>
          <Link href="/" target="_blank" className="enlace text-sm md:hidden">
            Ver tienda
          </Link>
        </div>
        <NavAdmin />
        <div className="hidden px-5 py-6 md:block">
          <Link href="/" target="_blank" className="enlace block text-sm">
            Ver tienda ↗
          </Link>
          <form action={logout} className="mt-3">
            <button type="submit" className="enlace text-sm">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 px-4 py-8 md:px-10 md:py-10">{children}</main>
    </div>
  );
}
