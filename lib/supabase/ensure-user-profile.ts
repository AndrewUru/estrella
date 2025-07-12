// C:\estrella\lib\supabase\ensure-user-profile.ts

import { supabase } from "@/lib/supabase/client";

export async function ensureUserProfile() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    console.error("No hay sesión activa.");
    return;
  }

  const user = session.user;

  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single();

  // Si hay error pero no es el típico de 'no existe fila'
  if (fetchError && fetchError.code !== "PGRST116" && fetchError.details !== "Results contain 0 rows") {
    console.error("Error consultando perfil:", fetchError.message);
    return;
  }

  // Si no existe el perfil, lo creamos con datos por defecto
  if (!existingProfile) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata.full_name || user.email,
      is_active: true,
      role: "alumna",
      plan: "gratis",
      plan_type: "7D",
      start_date: new Date().toISOString().split("T")[0],
    });

    if (insertError) {
      console.error("Error creando perfil:", insertError.message);
    } else {
      console.log("✅ Perfil creado con plan 'gratis' y tipo '7D'");
    }
  }
}
