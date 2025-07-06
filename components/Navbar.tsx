"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const user = session?.user;
  const avatar = user?.user_metadata?.avatar_url;
  const initials = user?.email?.slice(0, 2).toUpperCase();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="w-full bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-estrella.png"
            alt="Logo"
            width={32}
            height={32}
            priority
          />
          <span className="text-lg font-bold text-purple-700 dark:text-purple-300">
            Estrella del Alba
          </span>
        </Link>

        {/* Menú de escritorio */}
        <nav className="hidden sm:flex items-center gap-6 text-sm">
          <Link
            href="/informacion"
            className="hover:underline text-zinc-700 dark:text-zinc-300"
          >
            Sobre el curso
          </Link>
          <Link
            href="/preguntas"
            className="hover:underline text-zinc-700 dark:text-zinc-300"
          >
            Preguntas
          </Link>
          <Link
            href="/protected"
            className="hover:underline font-semibold text-purple-600 dark:text-purple-400"
          >
            Mi espacio
          </Link>

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                whileTap={{ scale: 0.9 }}
                className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden"
              >
                {avatar ? (
                  <Image src={avatar} alt="Avatar" width={32} height={32} />
                ) : (
                  initials
                )}
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-800 rounded-md shadow-xl"
                  >
                    <Link
                      href="/protected/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-zinc-800 dark:text-white hover:bg-purple-100 dark:hover:bg-zinc-700"
                    >
                      Perfil
                    </Link>
                    <button
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await supabase.auth.signOut();
                        router.push("/");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-zinc-800 dark:text-white hover:bg-purple-100 dark:hover:bg-zinc-700"
                    >
                      Cerrar sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Entrar
            </Link>
          )}

          <ThemeSwitcher />
        </nav>

        {/* Botón hamburguesa para móvil */}
        <div className="sm:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-zinc-700 dark:text-zinc-200"
            aria-label="Menú móvil"
          >
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 px-4 ${
          menuOpen ? "max-h-[400px] py-4" : "max-h-0 py-0"
        }`}
      >
        <div className="flex flex-col gap-3 text-sm text-zinc-800 dark:text-zinc-100">
          <Link
            href="/informacion"
            onClick={() => setMenuOpen(false)}
            className="hover:underline"
          >
            Sobre el curso
          </Link>
          <Link
            href="/preguntas"
            onClick={() => setMenuOpen(false)}
            className="hover:underline"
          >
            Preguntas
          </Link>
          <Link
            href="/protected"
            onClick={() => setMenuOpen(false)}
            className="hover:underline text-purple-600 dark:text-purple-400 font-medium"
          >
            Mi espacio
          </Link>

          {user ? (
            <>
              <Link
                href="/protected/profile"
                onClick={() => setMenuOpen(false)}
                className="hover:underline font-semibold"
              >
                Perfil
              </Link>
              <button
                onClick={async () => {
                  setMenuOpen(false);
                  await supabase.auth.signOut();
                  router.push("/");
                }}
                className="text-left hover:underline font-semibold text-red-500"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="hover:underline font-semibold"
            >
              Inicia sesión
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
