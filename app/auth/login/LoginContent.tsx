"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LoginForm } from "@/components/login-form";

export default function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const returnTo = searchParams.get("returnTo") || "/protected";
        router.push(returnTo);
      }
    }

    checkSession();
  }, [router, searchParams, supabase]);

  return <LoginForm />;
}
