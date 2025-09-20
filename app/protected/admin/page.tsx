"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";
import { LogOut, Users, BookOpenCheck, Music3, PlusCircle } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    async function validarAdmin() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?returnTo=/protected/admin");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

      if (error || profile?.role !== "admin") {
        router.push("/no-access");
        return;
      }

      setUserName(profile.full_name || "Admin");
      setAuthorized(true);
      setLoading(false);
    }

    validarAdmin();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-pink-700">
        Cargando panel de administradora...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-pink-50 via-white to-pink-100 text-pink-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">👑 Bienvenida, {userName}</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <a
          href="/protected/admin/usuarios"
          className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:bg-pink-50 transition border border-pink-100"
        >
          <Users className="w-6 h-6 text-pink-600" />
          <span className="text-lg font-medium">Gestionar usuarias</span>
        </a>

        <a
          href="/protected/admin/contenido"
          className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:bg-pink-50 transition border border-pink-100"
        >
          <BookOpenCheck className="w-6 h-6 text-pink-600" />
          <span className="text-lg font-medium">
            Editar contenido del curso
          </span>
        </a>

        <a
          href="/protected/admin/practicas"
          className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:bg-pink-50 transition border border-pink-100"
        >
          <Music3 className="w-6 h-6 text-pink-600" />
          <span className="text-lg font-medium">Ver prácticas</span>
        </a>

        <a
          href="/protected/admin/practicas#nueva"
          className="flex items-center gap-4 bg-white rounded-xl shadow p-5 hover:bg-pink-50 transition border border-pink-100"
        >
          <PlusCircle className="w-6 h-6 text-pink-600" />
          <span className="text-lg font-medium">Crear nueva práctica</span>
        </a>
      </div>
    </main>
  );
}
