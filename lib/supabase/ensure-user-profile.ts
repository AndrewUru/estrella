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

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("Error consultando perfil:", fetchError.message);
    return;
  }

  if (!existingProfile) {
    const { error: insertError } = await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata.full_name || user.email,
      plan: "gratis",
    });

    if (insertError) {
      console.error("Error creando perfil:", insertError.message);
    } else {
      console.log("Perfil creado con plan 'gratis'");
    }
  }
}
