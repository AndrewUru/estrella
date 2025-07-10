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
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) throw signUpError;

  const user = data.user;
  if (!user || !user.id) throw new Error("No se pudo crear el usuario");

  const { error: insertError, data } = await supabase.from("profiles").insert({
    id: user.id,
    email,
    full_name: fullName,
    is_active: planType === "gratis",
    start_date: new Date().toISOString().split("T")[0],
    created_at: new Date().toISOString(),
    role: "alumna",
    subscription_id: subscriptionId,
    plan: planType,
    plan_type: planType,
  });

  if (insertError) {
    console.error("❌ Insert error:", insertError);
    throw insertError;
  }

  return user;
}
