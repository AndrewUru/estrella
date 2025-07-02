"use client";

import { useSession } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { Button } from "./ui/button";
import LogoutButton from "./logout-button";

export function AuthButton() {
  const session = useSession();

  return session?.user ? (
    <div className="flex items-center gap-4">
      Hola, {session.user.email}!
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Iniciar sesión</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Registrarse</Link>
      </Button>
    </div>
  );
}
