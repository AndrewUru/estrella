// C:\estrella\app\protected\admin\usuarios\page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

interface Usuario {
  id: string;
  email: string;
  full_name: string;
  role: string;
  plan?: string | null;
  plan_type?: string | null;
  subscription_active: boolean | null;
  start_date?: string | null;
  end_date?: string | null;
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsuarios() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?returnTo=/protected/admin/usuarios");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        router.push("/no-access");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, email, full_name, role, plan, plan_type, subscription_active, start_date, end_date"
        );

      if (error) {
        setError("No se pudieron cargar las usuarias.");
      } else {
        setUsuarios(data || []);
      }

      setLoading(false);
    }

    fetchUsuarios();
  }, [router]);

  const toggleSuscripcion = async (
    userId: string,
    estadoActual: boolean | null
  ) => {
    const nuevoEstado = estadoActual !== true; // null o false → true
    const { error } = await supabase
      .from("profiles")
      .update({ subscription_active: nuevoEstado })
      .eq("id", userId);

    if (!error) {
      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, subscription_active: nuevoEstado } : u
        )
      );
    }
  };

  if (loading) return <p className="p-6">Cargando usuarias...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-primary">
        👥 Usuarias registradas
      </h1>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th className="p-3 font-semibold">Nombre</th>
              <th className="p-3 font-semibold">Correo</th>
              <th className="p-3 font-semibold">Rol</th>
              <th className="p-3 font-semibold">Plan</th>
              <th className="p-3 font-semibold">Tipo</th>
              <th className="p-3 font-semibold">Inicio</th>
              <th className="p-3 font-semibold">Vencimiento</th>
              <th className="p-3 text-center font-semibold">Suscripción</th>
              <th className="p-3 text-center font-semibold">Editar</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr
                key={u.id}
                className={i % 2 ? "bg-muted/40" : "bg-background"}
              >
                <td className="p-3">{u.full_name || "—"}</td>
                <td className="p-3 text-muted-foreground">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">{u.plan || "—"}</td>
                <td className="p-3">{u.plan_type || "—"}</td>
                <td className="p-3">
                  {u.start_date
                    ? new Date(u.start_date).toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-3">
                  {u.end_date ? new Date(u.end_date).toLocaleDateString() : "—"}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() =>
                      toggleSuscripcion(u.id, u.subscription_active)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-medium border shadow-sm transition duration-150 ${
                      u.subscription_active
                        ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    }`}
                  >
                    {u.subscription_active ? "Activa" : "Inactiva"}
                  </button>
                </td>
                <td className="p-3 text-center">
                  <a
                    href={`/protected/admin/usuarios/${u.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
