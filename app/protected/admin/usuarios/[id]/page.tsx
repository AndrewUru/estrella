"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface Usuario {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  plan: string | null;
  plan_type: string | null;
  subscription_active: boolean | null;
  start_date: string | null;
  end_date: string | null;
}

export default function EditUsuarioPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    async function cargarUsuario() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/auth/login?returnTo=/protected/admin/usuarios/${userId}`);
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
        .select(
          "id, email, full_name, role, plan, plan_type, subscription_active, start_date, end_date"
        )
        .eq("id", userId)
        .single<Usuario>();

      if (!error && data) {
        setUsuario(data);
      }
      setLoading(false);
    }

    cargarUsuario();
  }, [router, userId]);

  const handleChange = <T extends keyof Usuario>(campo: T, valor: Usuario[T]) => {
    setUsuario((prev) => (prev ? { ...prev, [campo]: valor } : prev));
  };

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usuario) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: usuario.full_name,
        role: usuario.role,
        plan: usuario.plan,
        plan_type: usuario.plan_type,
        subscription_active: usuario.subscription_active,
        start_date: usuario.start_date,
        end_date: usuario.end_date,
      })
      .eq("id", usuario.id);

    if (error) {
      alert("Error al actualizar usuaria");
    } else {
      router.push("/protected/admin/usuarios");
    }
  };

  if (loading) return <p className="p-6">Cargando usuaria...</p>;
  if (!usuario) return <p className="p-6">Usuaria no encontrada</p>;

  return (
    <main className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Editar usuaria</h1>
      <form onSubmit={guardar} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nombre</label>
          <Input
            value={usuario.full_name || ""}
            onChange={(e) => handleChange("full_name", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Correo</label>
          <Input value={usuario.email} disabled />
        </div>
        <div>
          <label className="block text-sm mb-1">Rol</label>
          <select
            className="w-full border border-input bg-transparent rounded-md px-3 py-2 text-sm"
            value={usuario.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            <option value="user">usuaria</option>
            <option value="facilitator">facilitadora</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Plan</label>
          <Input
            value={usuario.plan || ""}
            onChange={(e) => handleChange("plan", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Tipo de plan</label>
          <Input
            value={usuario.plan_type || ""}
            onChange={(e) => handleChange("plan_type", e.target.value)}
            placeholder="premium-mensual, premium-anual..."
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Inicio</label>
          <Input
            type="date"
            value={usuario.start_date ? usuario.start_date.slice(0, 10) : ""}
            onChange={(e) => handleChange("start_date", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Vencimiento</label>
          <Input
            type="date"
            value={usuario.end_date ? usuario.end_date.slice(0, 10) : ""}
            onChange={(e) => handleChange("end_date", e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            checked={usuario.subscription_active ?? false}
            onCheckedChange={(checked) =>
              handleChange("subscription_active", Boolean(checked))
            }
          />
          <span className="text-sm">Suscripción activa</span>
        </div>
        <Button type="submit">Guardar cambios</Button>
      </form>
    </main>
  );
}
