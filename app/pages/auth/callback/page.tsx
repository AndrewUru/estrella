// pages/auth/callback.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const returnTo = router.query.returnTo as string | undefined;

  useEffect(() => {
    const syncUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        console.error("Error obteniendo usuario:", error);
        return;
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (
        profileError &&
        (profileError.code === "PGRST116" ||
          profileError.message.includes("0 rows"))
      ) {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          is_active: true,
          role: "alumna",
          plan: "gratis",
          plan_type: "7D",
          start_date: new Date().toISOString().split("T")[0],
        });
      }

      router.replace(returnTo || "/bienvenida");
    };

    syncUser();
  }, [router, returnTo]);

  return <p className="text-center mt-10">Autenticando...</p>;
}
