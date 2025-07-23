"use client";

import { supabase } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { useAuthRedirect } from "@/lib/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function LoginForm() {
  useAuthRedirect(); // Redirige si ya está logueado

  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") ?? "/protected";

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${
          process.env.NEXT_PUBLIC_BASE_URL
        }/auth/callback?returnTo=${encodeURIComponent(returnTo)}`,
      },
    });
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full bg-card text-card-foreground shadow-2xl rounded-xl border border-border p-6 space-y-6">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-[hsl(var(--primary))]">
            Accede a tu espacio sagrado
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Conecta con tu viaje interior desde cualquier parte del mundo.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 h-12 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.85)] text-[hsl(var(--primary-foreground))] text-sm font-medium rounded-full transition-all duration-200"
          >
            <Image
              src="/google-icon.svg"
              alt="Google"
              width={20}
              height={20}
              className="dark:invert"
            />
            Iniciar sesión con Google
          </Button>
          <div className="text-center text-xs text-muted-foreground pt-2">
            Al ingresar, aceptas nuestro{" "}
            <a
              href="/terminos"
              className="underline hover:text-[hsl(var(--primary))]"
            >
              código ético y de integridad energética
            </a>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
