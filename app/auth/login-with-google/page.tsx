"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

export default function LoginWithGooglePage() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000/auth/callback"
            : "https://estrelladelalba.com/auth/callback",
      },
    });

    if (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
    }
  };

  useEffect(() => {
    handleGoogleLogin();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <p>Redirigiendo a Google...</p>
    </div>
  );
}
