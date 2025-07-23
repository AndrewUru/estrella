"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const syncUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) return;

      const { id, email, user_metadata } = user;
      const full_name = user_metadata?.full_name || "";
      const avatar_url = user_metadata?.avatar_url || "";

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", id)
        .maybeSingle();

      const profileData = {
        id,
        email,
        full_name,
        avatar_url,
        is_active: true,
        role: "alumna",
        plan: "gratis",
        plan_type: "7D",
        start_date: new Date().toISOString().split("T")[0],
      };

      if (!profile && !profileError) {
        await supabase.from("profiles").insert([profileData]);
      } else {
        await supabase.from("profiles").update(profileData).eq("id", id);
      }

      const params = new URLSearchParams(window.location.search);
      const rawReturnTo = params.get("returnTo") ?? "";
      const isSafePath = rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//");
      const safePath = isSafePath ? rawReturnTo : "/protected";

      router.replace(safePath);
    };

    syncUser();
  }, [router]);

  return <p className="text-center mt-10">Autenticando...</p>;
}
