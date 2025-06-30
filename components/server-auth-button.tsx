import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function ServerAuthButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <form action="/auth/sign-out" method="post">
      <button type="submit">Cerrar sesión</button>
    </form>
  ) : (
    <Link href="/auth/login">Iniciar sesión</Link>
  );
}
