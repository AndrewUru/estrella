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
  // Paso 1: Crear usuario en auth
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error("❌ Error al crear usuario:", signUpError);
    throw new Error("Error al registrar usuario: " + signUpError.message);
  }

  const user = data.user;
  const userId = user?.id;

  if (!userId) {
    console.error("⚠️ Usuario sin ID:", data);
    throw new Error("No se pudo obtener el ID del usuario");
  }

  // Paso 2: Crear perfil
  const { error: insertError } = await supabase.from("profiles").insert({
    id: userId,
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
    console.error("❌ Error al insertar perfil:", insertError);
    throw new Error("Error al guardar el perfil: " + insertError.message);
  }

  return user;
}
