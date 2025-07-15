// app/protected/profile/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { User, Mail, Crown, Shield, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { UserProfile } from "@/types/supabase";

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
    plan,
    is_active,
    role,
    full_name,
    email,
    avatar_url
  `
    )
    .eq("id", user.id)
    .single<UserProfile>();

  if (error) console.error("Error al cargar perfil:", error.message);

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800"
      : "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800";
  };

  const getPlanColor = (planType: string) => {
    switch (planType?.toLowerCase()) {
      case "premium":
        return "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800";
      case "pro":
        return "text-purple-700 bg-purple-50 border-purple-200 dark:text-purple-400 dark:bg-purple-900/20 dark:border-purple-800";
      default:
        return "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800";
    }
  };

  return (
    <main className="max-w-2xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
          Mi Perfil
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="space-y-6">
        {/* Datos personales */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                Información Personal
              </h2>
            </div>
          </div>

          <div className="px-6 py-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <Mail className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <div className="flex-1">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm font-medium text-zinc-900 dark:text-white">
                  {user.email}
                </p>
              </div>
            </div>

            {user.user_metadata?.full_name && (
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                <User className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Nombre completo
                  </p>
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    {profile?.full_name ||
                      user.user_metadata?.full_name ||
                      "Sin nombre definido"}
                  </p>
                </div>
              </div>
            )}
          </div>
          {/* Foto de perfil */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Foto de Perfil
                </h2>
              </div>
            </div>
            <div className="px-6 py-4 text-center">
              <Image
                src={profile?.avatar_url?.trim() || "/default-avatar.png"}
                alt="Foto de perfil"
                fill
                className="object-cover"
              />
              <form
                action="/api/upload-avatar"
                method="POST"
                encType="multipart/form-data"
                className="mt-4 flex flex-col items-center gap-2"
              >
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  className="text-sm"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:bg-primary/80"
                >
                  Subir nueva imagen
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Suscripción */}
        {profile && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Suscripción
                </h2>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plan */}

                <p className="text-sm">
                  <strong>Plan:</strong> {profile?.plan || "No definido"}
                </p>

                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                      Plan actual
                    </p>
                  </div>
                  {profile.plan_type ? (
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPlanColor(
                        profile.plan_type
                      )}`}
                    >
                      {profile.plan_type}
                    </span>
                  ) : (
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      Sin plan asignado
                    </span>
                  )}
                </div>

                {/* Estado */}
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {profile.is_active ? (
                      <CheckCircle className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    )}
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                      Estado
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      profile.is_active
                    )}`}
                  >
                    {profile.is_active ? "Activa" : "Inactiva"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
              <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                Privacidad y Seguridad
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                Tu información está protegida y encriptada. Solo tú puedes
                acceder a estos datos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
