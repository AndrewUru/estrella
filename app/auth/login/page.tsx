// app/auth/login/page.tsx
import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-background text-foreground">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 shadow-2xl rounded-2xl overflow-hidden bg-card text-card-foreground border border-border">
        {/* Columna izquierda - Inspiracional */}
        <div className="hidden md:flex flex-col justify-center items-start p-10 
  bg-gradient-to-b from-[hsl(var(--accent)/0.1)] to-[hsl(var(--background))] 
  dark:from-[hsl(var(--accent)/0.2)] dark:to-[hsl(var(--background))] 
  text-foreground space-y-6">
          <h2 className="text-4xl font-bold leading-snug">
            Reconecta con tu{" "}
            <span className="text-[hsl(var(--primary))]">alma</span>
          </h2>
          <p className="text-base text-muted-foreground">
            Estás por entrar en un espacio de transformación interior. En solo 7
            días, activarás tu claridad energética, propósito espiritual y dones
            intuitivos.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>🌟 Acceso inmediato a prácticas vibracionales</li>
            <li>🎧 Playlist ceremonial para tu viaje interior</li>
            <li>📓 PDF para acompañar tu proceso</li>
          </ul>
          <p className="text-xs text-muted-foreground pt-4">
            Tu estrella interior te está esperando.
          </p>
        </div>

        {/* Columna derecha - Login */}
        <div className="flex flex-col justify-center px-6 sm:px-10 py-10 space-y-6 w-full">
          <div className="text-center space-y-2">
          </div>
          <Suspense
            fallback={
              <div className="text-center text-[hsl(var(--primary))]">
                Cargando login...
              </div>
            }
          >
            <LoginContent />
          </Suspense>
          <div className="text-center text-xs text-muted-foreground">
            ¿Primera vez aquí?{" "}
            <a
              href="/auth/register"
              className="text-[hsl(var(--primary))] hover:underline"
            >
              Crea tu cuenta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
