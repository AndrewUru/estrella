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
  plan?: string;
  subscription_active: boolean | null; // <--- soporte para null
  start_date?: string;
  end_date?: string;
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
          "id, email, full_name, role, plan, subscription_active, start_date, end_date"
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
      <h1 className="text-2xl font-bold text-pink-800">
        👥 Usuarias registradas
      </h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-pink-100 text-pink-800">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-left">Correo</th>
              <th className="p-2 text-left">Rol</th>
              <th className="p-2 text-left">Plan</th>
              <th className="p-2 text-left">Inicio</th>
              <th className="p-2 text-left">Vencimiento</th>
              <th className="p-2 text-center">Suscripción</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u, i) => (
              <tr key={u.id} className={i % 2 ? "bg-pink-50" : "bg-white"}>
                <td className="p-2">{u.full_name || "—"}</td>
                <td className="p-2 text-gray-600">{u.email}</td>
                <td className="p-2 capitalize">{u.role}</td>
                <td className="p-2">{u.plan || "—"}</td>
                <td className="p-2">
                  {u.start_date
                    ? new Date(u.start_date).toLocaleDateString()
                    : "—"}
                </td>
                <td className="p-2">
                  {u.end_date ? new Date(u.end_date).toLocaleDateString() : "—"}
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() =>
                      toggleSuscripcion(u.id, u.subscription_active)
                    }
                    className={`px-3 py-1 rounded-full text-xs font-semibold shadow border transition ${
                      u.subscription_active === true
                        ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    {u.subscription_active === true ? "Activa" : "Inactiva"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
