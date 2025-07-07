// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies as getCookies } from "next/headers";

export function createClient() {
  const cookieStore = getCookies(); // 👈 Esto ya no es una promesa, es sincrónico

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
      },
    }
  );
}
