import { Navbar } from "@/components/Navbar";
import { LoginForm } from "@/components/login-form";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-svh w-full flex flex-col">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENIDO */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-10">
        <div className="w-full max-w-sm bg-card rounded-2xl border border-border shadow-xl p-8 flex flex-col items-center backdrop-blur-sm">
          {/* Icono o logo */}
          <div className="mb-6">
            <Image
              src="/logo-estrella.png"
              alt="Logo Estrella"
              width={64}
              height={64}
              className="rounded-full shadow-md"
              priority
            />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
            Bienvenido a Estrella del Alba
          </h1>
          <p className="text-muted-foreground mb-6 text-center text-sm">
            Inicia sesión para continuar tu camino interior.
          </p>

          {/* Formulario */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
