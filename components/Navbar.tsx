"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";

export function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Obtener la sesión actual
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    getSession();

    // Suscripción a cambios de sesión (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const user = session?.user;

  return (
    <nav className="w-full py-4 px-6 bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-purple-600">
        Estrella del Alba
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/informacion"
          className="text-sm text-gray-700 dark:text-gray-200"
        >
          Sobre el curso
        </Link>

        <Link
          href="/preguntas"
          className="text-sm text-gray-700 dark:text-gray-200"
        >
          Preguntas
        </Link>

        <Link href="/protected" className="text-sm text-purple-600 font-medium">
          Mi espacio
        </Link>

        {user ? (
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/");
            }}
            className="text-sm text-red-500 font-semibold"
          >
            Cerrar sesión
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="text-sm text-purple-600 font-semibold"
          >
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
}
