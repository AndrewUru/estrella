// app/auth/login/page.tsx
import { Suspense } from "react";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4">
      <Suspense fallback={<div>Cargando login...</div>}>
        <LoginContent />
      </Suspense>
    </div>
  );
}
