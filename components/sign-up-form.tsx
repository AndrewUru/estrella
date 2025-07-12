// app/auth/sign-up/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_BASE_URL + "/protected",
      },
    });

    if (error) setError(error.message);
    else router.push("/bienvenida");

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: process.env.NEXT_PUBLIC_BASE_URL + "auth/callback",
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

      <form onSubmit={handleSignUp} className="space-y-4">
        <Input
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Contraseña segura"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="text-sm text-red-500 text-center font-medium">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </Button>
      </form>

      <p className="text-center text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-violet-600 hover:underline">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  );
}
