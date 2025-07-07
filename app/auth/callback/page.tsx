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
        router.replace("/protected");
      } else {
        router.replace("/auth/login");
      }
    };

    checkSession();
  }, [router]);

  return <p className="text-center p-4">Redirigiendo...</p>;
}
