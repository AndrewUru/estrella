// C:\estrella\lib\supabase\register-user.ts

import { supabase } from "./client";

interface RegisterUserProps {
  email: string;
  password: string;
  subscriptionId: string | null;
  planType: "gratis" | "premium-mensual" | "premium-anual";
  fullName: string;
}

export async function registerUser({
  email,
  password,
  subscriptionId,
  planType,
  fullName,
}: RegisterUserProps) {
  // Crear el usuario en auth
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) throw signUpError;

  const user = data.user;
  if (!user || !user.id) throw new Error("No se pudo crear el usuario");

  // Insertar perfil en la tabla 'profiles'
  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id, // 👈 clave primaria correcta
    email,
    full_name: fullName,
    is_active: planType === "gratis",
    start_date: new Date().toISOString().split("T")[0],
    role: "alumna",
    subscription_id: subscriptionId,
    plan: planType,
  });

  if (insertError) throw insertError;

  return user;
}
