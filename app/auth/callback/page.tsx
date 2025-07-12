//C:\estrella\app\auth\callback\page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { ensureUserProfile } from "@/lib/supabase/ensure-user-profile";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        await ensureUserProfile(); // Crea perfil si no existe con plan "gratis"
        router.replace("/protected");
      } else {
        router.replace("/auth/login");
      }
    };

    checkSession();
  }, [router]);

  return <p className="text-center p-4">Redirigiendo...</p>;
}
