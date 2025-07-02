"use client";

import { supabase } from "@/lib/supabase/client";

export async function registerUser({
  email,
  password,
  subscriptionId,
  planType,
}: {
  email: string;
  password: string;
  subscriptionId?: string;
  planType?: "mensual" | "anual";
}) {
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (signUpError) throw signUpError;

  const user = data.user;
  const now = new Date().toISOString();

  if (!user) {
    throw new Error("No se pudo crear el usuario.");
  }

  // Insertar o actualizar el perfil
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    email,
    created_at: now,
    start_date: now,
    subscription_id: subscriptionId ?? null,
    plan_type: planType ?? null,
  });

  if (profileError) throw profileError;

  return { success: true };
}
