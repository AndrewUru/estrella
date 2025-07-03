import { ForgotPasswordForm } from "@/components/forgot-password-form";

export default function Page() {
  return (
    <div className="min-h-svh w-full flex flex-col">
      {/* CONTENIDO */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-10">
        <div className="w-full max-w-sm bg-card rounded-2xl border border-border shadow-xl p-8 flex flex-col items-center backdrop-blur-sm">
          {/* Icono */}
          <div className="mb-6">
            <svg width={56} height={56} viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#F59E0B" />
              <path
                d="M24 16v8l6 3"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Formulario */}
          <ForgotPasswordForm />

          {/* Enlace de regreso */}
          <div className="mt-6 text-sm text-muted-foreground text-center">
            <a href="/auth/login" className="text-primary hover:underline">
              Volver al inicio de sesión
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
