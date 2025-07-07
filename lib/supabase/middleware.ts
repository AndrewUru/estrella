import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";
import { cookies } from "next/headers"; // Asegúrate de tenerlo importado

export async function updateSession(request: NextRequest) {
  // ⚠️ Primero recuperamos las cookies con `await`
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => {
          const cookie = cookieStore.get(name);
          return cookie?.value;
        },
        set: (name, value, options) => {
          request.cookies.set(name, value, options); // ← podrías necesitar NextResponse aquí
        },
        remove: (name) => {
          request.cookies.set(name, "", { maxAge: -1 });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publicRoutes = [
    "/",
    "/informacion",
    "/preguntas",
    "/suscripcion",
    "/favicon.ico",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) =>
      request.nextUrl.pathname === route ||
      request.nextUrl.pathname.startsWith(route)
  );

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // ← Esta línea también es importante
}
