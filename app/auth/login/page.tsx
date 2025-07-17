// app/auth/login/page.tsx
import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center  px-4">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold ">
            Bienvenida a Estrella del Alba
          </h1>
          <p className="text-sm ">
            Inicia sesión para continuar tu viaje de reconexión con el alma.
          </p>
        </div>
        <Suspense
          fallback={<div className="text-center">Cargando login...</div>}
        >
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
}
