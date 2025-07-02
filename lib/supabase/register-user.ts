import { supabase } from "./client";

interface RegisterUserProps {
  email: string;
  password: string;
  subscriptionId: string;
  planType: "mensual" | "anual";
  fullName: string;
}

export async function registerUser({
  email,
  password,
  subscriptionId,
  planType,
  fullName,
}: RegisterUserProps) {
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) throw signUpError;

  const user = data.user;
  if (!user || !user.id) throw new Error("No se pudo crear el usuario");

  const { error: insertError } = await supabase.from("profiles").insert({
    uuid: user.id, // 👈 clave para relacionar el perfil con el usuario
    email,
    full_name: fullName,
    is_active: false,
    start_date: new Date().toISOString().split("T")[0],
    role: "alumna",
    subscription_id: subscriptionId,
    plan: planType,
  });

  if (insertError) throw insertError;

  return user;
}
