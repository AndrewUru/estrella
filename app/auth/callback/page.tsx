// app/auth/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/bienvenida";

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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (
        profileError &&
        (profileError.code === "PGRST116" ||
          profileError.message.includes("0 rows"))
      ) {
        const { error: insertError } = await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          is_active: true,
          role: "alumna",
          plan: "gratis",
          plan_type: "7D",
          start_date: new Date().toISOString().split("T")[0],
        });

        if (insertError) {
          console.error("Error creando perfil:", insertError.message);
        } else {
          console.log("✅ Perfil creado manualmente");
        }
      } else {
        console.log("Perfil ya existe:", profile);
      }

      router.push(returnTo);
    };

    syncUser();
  }, [router, returnTo]);

  return <p className="text-center mt-10">Autenticando...</p>;
}
