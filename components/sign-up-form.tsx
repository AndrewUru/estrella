//C:\estrella\components\sign-up-form.tsx

"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://estrelladelalba.com";

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-xl space-y-6">
      <h1 className="text-2xl font-bold text-center">Crear Cuenta</h1>

      <Button onClick={handleGoogleSignUp} className="w-full flex gap-2">
        <Image src="/google-icon.svg" alt="Google" width={20} height={20} />
        Registrarse con Google
      </Button>

      <p className="text-center text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-violet-600 hover:underline">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}
