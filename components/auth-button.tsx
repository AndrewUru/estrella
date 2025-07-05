"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import LogoutButton from "./logout-button";
import { useAuthStatus } from "@/lib/hooks/useAuthStatus";

export function AuthButton() {
  const { loading, loggedIn, user } = useAuthStatus();

  if (loading) return null;

  return loggedIn ? (
    <div className="flex items-center gap-4">
      <Link href="/protected" className="hover:underline text-sm">
        Hola, {user?.email}!
      </Link>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="outline">
        <Link href="/auth/login">Iniciar sesión</Link>
      </Button>
      <Button asChild size="sm" variant="default">
        <Link href="/auth/sign-up">Registrarse</Link>
      </Button>
    </div>
  );
}
