// C:\estrella\app\auth\login\page.tsx
import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default async function Page({
  searchParams,
}: {
  searchParams?: { returnTo?: string };
}) {
  const supabase = createServerComponentClient({ cookies: () => cookies() });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const returnTo = searchParams?.returnTo ?? "/protected";
    redirect(returnTo);
  }
  return (
    <div className="min-h-svh w-full flex flex-col relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
        <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(0 0 0 / 0.1) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 p-2 md:p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-blue-500/10 p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-75 animate-pulse"></div>
            <div className="absolute inset-[1px] rounded-3xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl"></div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-8 group cursor-pointer">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative bg-white dark:bg-slate-700 rounded-full p-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Image
                      src="/logo-estrella.png"
                      alt="Logo Estrella"
                      width={56}
                      height={56}
                      className="rounded-full"
                      priority
                    />
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
                  Bienvenido
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
                  a Estrella del Alba
                </p>
                <div className="mt-3 h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
              </div>

              <div className="w-full">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
