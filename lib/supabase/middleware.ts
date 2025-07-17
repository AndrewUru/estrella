// lib/supabase/middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
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
    "/auth/login",
    "/auth/register",
    "/auth/reset",
    "/favicon.ico",
  ];

  const isPublic = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("returnTo", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}
