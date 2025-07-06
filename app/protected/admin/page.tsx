// app/protected/admin/page.tsx
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const user = session.user;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (error || !profile?.is_admin) {
    redirect("/"); // o mostrar un error 403
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <p className="text-zinc-700 dark:text-zinc-200">
        Bienvenido, administrador. Aquí podrás gestionar la plataforma.
      </p>

      {/* Aquí se pueden incluir tablas, métricas, y herramientas de gestión */}
    </main>
  );
}
