import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-background">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        {/* NAVBAR */}
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
            <div className="flex gap-5 items-center font-semibold">
              <Link href={"/"}>🌟 Estrella del Alba</Link>
              <DeployButton />
            </div>
            {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
          </div>
        </nav>

        {/* HERO SECTION */}
        <section className="flex flex-col items-center gap-6 text-center mt-20 px-6">
          <h1 className="text-4xl font-bold">Tu camino empieza hoy</h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            Acompañamos tu progreso diario con seguimiento personalizado.
            Registra tu avance, desbloquea niveles y mantén tu compromiso.
          </p>
        </section>

        {/* PASOS INICIALES */}
        <section className="w-full max-w-3xl px-5 mt-10">
          <h2 className="font-semibold text-lg mb-4">Primeros pasos</h2>
          {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
        </section>

        {/* FOOTER */}
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-10">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>{" "}
            &{" "}
            <a
              href="https://nextjs.org/"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Next.js
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
