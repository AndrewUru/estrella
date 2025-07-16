// app/auth/login/page.tsx
import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies: () => cookies() });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headersList = await headers();
  const url = new URL(headersList.get("x-url") ?? "http://localhost");
  const returnTo = url.searchParams.get("returnTo") ?? "/protected";

  if (session) {
    redirect(returnTo);
  }

  return (
    <div className="min-h-svh w-full flex flex-col relative overflow-hidden">
      <LoginForm />
    </div>
  );
}
