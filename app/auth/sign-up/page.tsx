import Image from "next/image";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="min-h-svh w-full flex flex-col">
    

      {/* Contenido centrado */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm rounded-2xl shadow-xl p-8 flex flex-col items-center">
          {/* Logo */}
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
          <h1 className="text-2xl font-bold  mb-2 text-center">
            Crea tu cuenta en Estrella
          </h1>
          <p className=" mb-6 text-center text-sm">
            Regístrate para comenzar tu camino interior.
          </p>

          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
