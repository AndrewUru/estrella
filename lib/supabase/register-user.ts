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

  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    email,
    created_at: new Date().toISOString(),
  });

  if (profileError) throw profileError;

  return { success: true };
}
