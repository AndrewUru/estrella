// lib/supabase/register-user.ts
"use client";

import { supabase } from "@/lib/supabase/client";

export async function registerUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  // Registro
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) throw signUpError;

  const user = data.user;

  // Inserción en tabla profiles
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user?.id,
    email,
    created_at: new Date().toISOString(),
  });

  if (profileError) throw profileError;

  return { success: true };
}
