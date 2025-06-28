import { LoginForm } from "@/components/login-form";

export default function Page() {
  return (
    <div className="min-h-svh w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 md:p-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        {/* Logo o ícono */}
        <div className="mb-6">
          <svg width={48} height={48} viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="24" fill="#6366F1" />
            <path d="M24 14l6 12h-12l6-12z" fill="#fff" />
          </svg>
        </div>
        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Bienvenido a Estrella
        </h1>
        <p className="text-gray-500 mb-6 text-center text-sm">
          Inicia sesión para continuar tu camino interior.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
