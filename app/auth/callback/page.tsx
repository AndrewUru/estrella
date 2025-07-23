"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

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
        .select("id, role, plan, plan_type, start_date")
        .eq("id", id)
        .maybeSingle();

      const profileData = {
        email,
        full_name,
        avatar_url,
        is_active: true,
        role: profile?.role ?? "alumna",
        plan: profile?.plan ?? "gratis",
        plan_type: profile?.plan_type ?? "7D",
        start_date:
          profile?.start_date ?? new Date().toISOString().split("T")[0],
      };

      if (!profile && !profileError) {
        await supabase.from("profiles").insert([{ id, ...profileData }]);
      } else {
        await supabase.from("profiles").update(profileData).eq("id", id);
      }

      const params = new URLSearchParams(window.location.search);
      const rawReturnTo = params.get("returnTo") ?? "";
      const isSafePath =
        rawReturnTo.startsWith("/") && !rawReturnTo.startsWith("//");
      const safePath = isSafePath ? rawReturnTo : "/protected";

      router.replace(safePath);
    };

    syncUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="flex flex-col items-center space-y-4 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="text-[hsl(var(--primary))]"
        >
          <Sparkles size={48} strokeWidth={1.5} />
        </motion.div>
        <p className="text-lg font-medium text-[hsl(var(--primary))]">
          Autenticando...
        </p>
        <p className="text-sm text-muted-foreground">
          Estamos alineando tu energía con tu perfil interior. Un momento...
        </p>
      </div>
    </div>
  );
}
