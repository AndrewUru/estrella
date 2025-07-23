// app/auth/login/page.tsx
import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Columna izquierda - Inspiracional */}
        <div className="hidden md:flex flex-col justify-center items-start p-10 bg-gradient-to-b from-[#f7e9ff] to-[#ffffff] text-[#5b2c8f] space-y-6">
          <h2 className="text-4xl font-bold leading-snug">
            Reconecta con tu <span className="text-[#7c3aed]">alma</span>
          </h2>
          <p className="text-base text-gray-700">
            Estás por entrar en un espacio de transformación interior. En solo 7
            días, activarás tu claridad energética, propósito espiritual y dones
            intuitivos.
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>🌟 Acceso inmediato a prácticas vibracionales</li>
            <li>🎧 Playlist ceremonial para tu viaje interior</li>
            <li>📓 Cuaderno PDF para acompañar tu proceso</li>
            <li>🌀 Comunidad de almas afines</li>
          </ul>
          <p className="text-xs text-gray-500 pt-4">
            Tu estrella interior te está esperando.
          </p>
        </div>

        {/* Columna derecha - Login */}
        <div className="flex flex-col justify-center px-6 sm:px-10 py-10 space-y-6 w-full">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-[#7c3aed]">
              Bienvenida de nuevo
            </h1>
            <p className="text-sm text-gray-600">
              Ingresa para continuar tu viaje sagrado con Estrella del Alba.
            </p>
          </div>
          <Suspense
            fallback={
              <div className="text-center text-[#7c3aed]">
                Cargando login...
              </div>
            }
          >
            <LoginContent />
          </Suspense>
          <div className="text-center text-xs text-gray-400">
            ¿Primera vez aquí?{" "}
            <a href="/auth/register" className="text-[#7c3aed] hover:underline">
              Crea tu cuenta
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
