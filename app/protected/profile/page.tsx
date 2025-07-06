// app/protected/profile/page.tsx

import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user = session?.user;

  if (!user) {
    // Redirige si no hay sesión
    redirect("/auth/login");
  }

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select(
      "subscription_id, plan_type, is_active, current_day, ritual_done, has_completed_intro, progress_notes"
    )
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error al cargar perfil:", error.message);
  }

  return (
    <main className="max-w-xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Tu perfil</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-700 space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">Datos personales</h2>

          <p className="text-sm text-zinc-500">ID</p>
          <p className="font-mono text-sm mb-2">{user.id}</p>

          <p className="text-sm text-zinc-500">Email</p>
          <p className="font-medium mb-2">{user.email}</p>

          {user.user_metadata?.full_name && (
            <>
              <p className="text-sm text-zinc-500">Nombre</p>
              <p className="mb-2">{user.user_metadata.full_name}</p>
            </>
          )}

          <p className="text-sm text-zinc-500">Proveedor de login</p>
          <p className="mb-2">{user.app_metadata?.provider ?? "-"}</p>

          <p className="text-sm text-zinc-500">Creado el</p>
          <p className="mb-2">{new Date(user.created_at).toLocaleString()}</p>
        </section>

        {profileData && (
          <>
            <section>
              <h2 className="text-xl font-semibold mb-2">Suscripción</h2>

              <p className="text-sm text-zinc-500">ID de suscripción</p>
              <p className="font-mono text-sm mb-2">
                {profileData.subscription_id ?? "-"}
              </p>

              <p className="text-sm text-zinc-500">Plan</p>
              <p className="mb-2">{profileData.plan_type ?? "-"}</p>

              <p className="text-sm text-zinc-500">Estado</p>
              <p className="mb-2">
                {profileData.is_active ? "Activa" : "Inactiva"}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Progreso</h2>

              <p className="text-sm text-zinc-500">Día actual</p>
              <p className="mb-2">{profileData.current_day ?? "-"}</p>

              <p className="text-sm text-zinc-500">¿Completó introducción?</p>
              <p className="mb-2">
                {profileData.has_completed_intro ? "Sí" : "No"}
              </p>

              <p className="text-sm text-zinc-500">¿Ritual realizado hoy?</p>
              <p className="mb-2">{profileData.ritual_done ? "Sí" : "No"}</p>

              {profileData.progress_notes && (
                <>
                  <p className="text-sm text-zinc-500">Notas de progreso</p>
                  <p className="whitespace-pre-line">
                    {profileData.progress_notes}
                  </p>
                </>
              )}
            </section>
          </>
        )}

        <section>
          <h2 className="text-xl font-semibold mb-2">Acciones</h2>
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
