//C:\estrella\app\auth\callback\page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // Redirige después del login o registro exitoso
        router.replace("/protected");
      } else {
        // Redirige si falla o no hay sesión activa
        router.replace("/auth/login");
      }
    };

    checkSession();
  }, [router, supabase]);

  return <p className="text-center p-4">Redirigiendo...</p>;
}
