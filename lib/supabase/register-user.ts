import { supabase } from "./client";

export async function registerUser({
  email,
  password,
  subscriptionId,
  planType,
  fullName,
}: {
  email: string;
  password: string;
  subscriptionId: string | null;
  planType: "gratis" | "premium-mensual" | "premium-anual";
  fullName: string;
}) {
  // Paso 1: Crear usuario en auth
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        is_active: planType === "gratis",
        start_date: new Date().toISOString().split("T")[0],
        role: "alumna",
        subscription_id: subscriptionId,
        plan: planType === "gratis" ? "gratis" : "pago",
        plan_type: planType,
      },
    },
  });

  if (signUpError) {
    console.error("❌ Error al crear usuario:", signUpError);
    throw new Error("Error al registrar usuario: " + signUpError.message);
  }

  const user = data.user;

  if (!user?.id) {
    console.error("⚠️ Usuario sin ID:", data);
    throw new Error("No se pudo obtener el ID del usuario");
  }

  // Paso 2: Crear entrada en la tabla "profiles"
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    email,
    full_name: fullName,
    is_active: planType === "gratis",
    start_date: new Date().toISOString().split("T")[0],
    role: "alumna",
    subscription_id: subscriptionId,
    plan: planType === "gratis" ? "gratis" : "pago",
    plan_type: planType,
  });

  if (profileError) {
    console.error("❌ Error al insertar perfil:", profileError);
    throw new Error("Error al guardar perfil: " + profileError.message);
  }

  return user;
}
