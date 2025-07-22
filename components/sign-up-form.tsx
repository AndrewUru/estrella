//C:\estrella\components\sign-up-form.tsx

"use client";

import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://estrelladelalba.com";

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/protected`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/check-email");
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${baseUrl}/auth/callback`,
      },
    });
  };

  return (
    <Card className="max-w-md mx-auto p-6 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md border border-white/40 dark:border-gray-700/40 shadow-2xl rounded-3xl">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-2xl font-bold">Crear Cuenta</CardTitle>
        <CardDescription>Accede al curso con un solo clic</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleGoogleSignUp}
          className="w-full flex gap-2 h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
        >
          <Image
            src="/google-icon.svg"
            alt="Google"
            width={20}
            height={20}
            className="dark:invert"
          />
          Registrarse con Google
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-violet-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
        <p className="text-center text-xs text-muted-foreground">
          <Link href="/upgrade" className="hover:underline">
            Conoce nuestros planes
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
