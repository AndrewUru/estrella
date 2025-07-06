"use client";

import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type ProfileData = {
  subscription_id: string | null;
  plan_type: string | null;
  is_active: boolean;
  current_day: number | null;
  has_completed_intro: boolean;
  ritual_done: boolean;
  progress_notes: string | null;
};

export function ClientProfile() {
  const session = useSession();
  const user = session?.user;

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "subscription_id, plan_type, is_active, current_day, has_completed_intro, ritual_done, progress_notes"
        )
        .eq("id", user?.id)
        .single();

      if (error) {
        setError("No se pudo cargar el perfil.");
      } else {
        setProfile(data);
      }

      setLoading(false);
    };

    if (user) fetchProfile();
  }, [user]);

  if (!user) {
    return (
      <p className="text-red-500 mt-2">
        No se pudo obtener la sesión desde el cliente. Por favor, inicia sesión.
      </p>
    );
  }

  if (loading) {
    return <p className="text-zinc-500 mt-2">Cargando datos del perfil...</p>;
  }

  if (error) {
    return <p className="text-red-500 mt-2">{error}</p>;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-700 mt-4 space-y-6">
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

        <p className="text-sm text-zinc-500">Proveedor</p>
        <p className="mb-2">{user.app_metadata?.provider ?? "-"}</p>

        <p className="text-sm text-zinc-500">Creado el</p>
        <p className="mb-2">{new Date(user.created_at).toLocaleString()}</p>
      </section>

      {profile && (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-2">Suscripción</h2>
            <p className="text-sm text-zinc-500">ID de suscripción</p>
            <p className="font-mono text-sm mb-2">
              {profile.subscription_id ?? "-"}
            </p>

            <p className="text-sm text-zinc-500">Plan</p>
            <p className="mb-2">{profile.plan_type ?? "-"}</p>

            <p className="text-sm text-zinc-500">Estado</p>
            <p className="mb-2">{profile.is_active ? "Activa" : "Inactiva"}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Progreso</h2>
            <p className="text-sm text-zinc-500">Día actual</p>
            <p className="mb-2">{profile.current_day ?? "-"}</p>

            <p className="text-sm text-zinc-500">¿Completó introducción?</p>
            <p className="mb-2">{profile.has_completed_intro ? "Sí" : "No"}</p>

            <p className="text-sm text-zinc-500">¿Ritual realizado hoy?</p>
            <p className="mb-2">{profile.ritual_done ? "Sí" : "No"}</p>

            {profile.progress_notes && (
              <>
                <p className="text-sm text-zinc-500">Notas de progreso</p>
                <p className="whitespace-pre-line">{profile.progress_notes}</p>
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
  );
}
