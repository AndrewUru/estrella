// lib/hooks/useUserProfile.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export function useUserProfile() {
  const [fullName, setFullName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("uuid", user.id)
        .single();

      if (!error && data?.full_name) {
        setFullName(data.full_name);
      }

      setLoading(false);
    }

    fetchProfile();
  }, []);

  return { fullName, loading };
}
