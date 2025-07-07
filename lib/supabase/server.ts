// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr";
import { cookies as getCookies } from "next/headers";

export async function createClient() {
  const cookieStore = await getCookies(); // ✅ con await

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: () => {}, // No disponible en Server Component
        remove: () => {}, // No disponible en Server Component
      },
    }
  );
}
