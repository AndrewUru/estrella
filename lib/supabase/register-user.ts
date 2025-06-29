"use client";

import { supabase } from "@/lib/supabase/client";

export async function registerUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`, // ✅ redirección tras confirmar
    },
  });

  if (signUpError) throw signUpError;

  const session = data.session;
  const user = data.user;

  if (!session || !user) {
    return {
      success: false,
      message: "Por favor, revisa tu correo para confirmar tu cuenta.",
    };
  }

  const now = new Date().toISOString();

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    email,
    created_at: now,
    start_date: now, // 👈 esto habilita el desbloqueo progresivo
  });

  if (profileError) throw profileError;

  return { success: true };
}
