import type { Metadata } from "next";
import { FormNota } from "@/components/admin/form-nota";
import { TituloAdmin } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Nueva nota" };

export default function NuevaNota() {
  return (
    <>
      <TituloAdmin>Nueva nota</TituloAdmin>
      <div className="max-w-3xl">
        <FormNota />
      </div>
    </>
  );
}
