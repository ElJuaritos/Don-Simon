import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { esAdmin } from "@/lib/auth";
import { Logo } from "@/components/ui/logo";
import { FormLogin } from "./form-login";

export const metadata: Metadata = { title: "Entrar al panel", robots: { index: false } };

export default async function Login() {
  if (await esAdmin()) redirect("/admin");
  return (
    <main className="textura flex min-h-dvh items-center justify-center bg-cafe px-4">
      <div className="w-full max-w-sm bg-crema-claro p-8 md:p-10">
        <div className="text-center text-5xl">
          <Logo />
        </div>
        <h1 className="etiqueta mt-4 text-center text-cafe/85">Panel de administración</h1>
        <FormLogin />
      </div>
    </main>
  );
}
