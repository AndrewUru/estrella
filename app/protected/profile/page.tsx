// app/protected/profile/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;
  if (!user) redirect("/auth/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      `
      subscription_id,
      plan_type,
      is_active,
      current_day,
      ritual_done,
      has_completed_intro,
      progress_notes
    `
    )
    .eq("id", user.id)
    .single();

  if (error) console.error("Error al cargar perfil:", error.message);

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Tu perfil</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-700 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Datos personales</h2>
          <div className="space-y-1 text-sm">
            <p className="text-zinc-500">Email</p>
            <p className="font-medium">{user.email}</p>

            {user.user_metadata?.full_name && (
              <>
                <p className="text-zinc-500">Nombre</p>
                <p>{user.user_metadata.full_name}</p>
              </>
            )}
          </div>
        </section>

        {profile && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Suscripción</h2>
            <div className="space-y-1 text-sm">
              <p className="text-zinc-500">Plan</p>
              <p>{profile.plan_type ?? "-"}</p>

              <p className="text-zinc-500">Estado</p>
              <p>{profile.is_active ? "Activa" : "Inactiva"}</p>

              <p className="text-zinc-500">Día actual</p>
              <p>{profile.current_day ?? "-"}</p>
            </div>
          </section>
        )}

        <section>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
            >
              Cerrar sesión
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
