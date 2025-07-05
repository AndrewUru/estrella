// lib/hooks/useAuthStatus.ts
"use client";

import { useSession } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export function useAuthStatus() {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (session !== undefined) {
      setLoggedIn(!!session?.user);
      setLoading(false);
    }
  }, [session]);

  return { loading, loggedIn, user: session?.user };
}
