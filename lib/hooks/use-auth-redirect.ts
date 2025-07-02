// lib/hooks/use-auth-redirect.ts
"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

export function useAuthRedirect(redirectTo: string = "/protected") {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push(redirectTo);
    }
  }, [session, router, redirectTo]);
}
export function useAuthRedirectIfNotLoggedIn(
  redirectTo: string = "/auth/login"
) {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push(redirectTo);
    }
  }, [session, router, redirectTo]);
}
