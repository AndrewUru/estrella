"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  plan: string | null;
  plan_type: string | null;
}

export default function AdminPlanesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login?returnTo=/protected/admin/planes");
        return;
      }

      const { data: perfil } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (perfil?.role !== "admin") {
        router.push("/no-access");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, plan, plan_type");

      if (error) {
        setError("No se pudieron cargar las usuarias");
      } else {
        setProfiles(data as Profile[]);
      }

      setLoading(false);
    }

    load();
  }, [router]);

  const updatePlan = async (profile: Profile) => {
    const { error } = await supabase
      .from("profiles")
      .update({
        plan: profile.plan_type === "gratis" ? "gratis" : "premium",
        plan_type: profile.plan_type,
      })
      .eq("id", profile.id);

    if (error) {
      alert("Error al actualizar plan");
    } else {
      alert("✅ Plan actualizado");
    }
  };

  if (loading) return <p className="p-6">Cargando planes...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-primary">Planes de suscripción</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th className="p-3 font-semibold">Nombre</th>
              <th className="p-3 font-semibold">Correo</th>
              <th className="p-3 font-semibold">Plan tipo</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p, i) => (
              <tr key={p.id} className={i % 2 ? "bg-muted/40" : "bg-background"}>
                <td className="p-3">{p.full_name || "—"}</td>
                <td className="p-3 text-muted-foreground">{p.email}</td>
                <td className="p-3">
                  <select
                    value={p.plan_type || ""}
                    onChange={(e) =>
                      setProfiles((prev) =>
                        prev.map((pr) =>
                          pr.id === p.id ? { ...pr, plan_type: e.target.value } : pr
                        )
                      )
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="gratis">Gratis</option>
                    <option value="premium-mensual">Premium Mensual</option>
                    <option value="premium-anual">Premium Anual</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" onClick={() => updatePlan(p)}>
                    Guardar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

