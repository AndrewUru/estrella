"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Session } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  session: Session | null;
};

export function Navbar({ session }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const user = session?.user;
  const initials = user?.email?.slice(0, 2).toUpperCase();
  const avatar = user?.user_metadata?.avatar_url;

  return (
    <header className="w-full bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 relative z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-estrella.png"
            alt="Estrella del Alba Logo"
            width={32}
            height={32}
            priority
          />
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            Estrella del Alba
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
          <Link href="/informacion" className="hover:underline">
            Sobre el curso
          </Link>
          <Link href="/preguntas" className="hover:underline">
            Preguntas
          </Link>
          <Link href="/contacto" className="hover:underline">
            Contacto
          </Link>
          <Link
            href="/protected"
            className="hover:underline font-medium text-purple-600 dark:text-purple-400"
          >
            Mi espacio
          </Link>
          <ThemeSwitcher />
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                whileTap={{ scale: 0.9 }}
                className="rounded-full w-8 h-8 overflow-hidden bg-purple-600 text-white flex items-center justify-center text-xs font-bold"
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
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-800 rounded-md shadow-lg z-50"
                  >
                    <Link
                      href="/protected/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-zinc-700"
                    >
                      Perfil
                    </Link>
                    <button
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await fetch("/auth/signout", { method: "POST" });
                        router.push("/");

                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-white hover:bg-purple-100 dark:hover:bg-zinc-700"
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
              className="text-purple-600 font-semibold hover:underline"
            >
              Entrar
            </Link>
          )}
        </nav>

        <div className="sm:hidden flex items-center gap-2">
          <ThemeSwitcher />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-700 dark:text-gray-200"
            aria-label="Abrir menú"
          >
            {menuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <div
        className={`sm:hidden absolute top-16 left-0 w-full transition-all duration-300 ease-in-out overflow-hidden bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-700 ${
          menuOpen
            ? "opacity-100 translate-y-0 max-h-[500px] py-4 px-4"
            : "opacity-0 -translate-y-2 max-h-0 py-0 px-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-3 text-sm text-gray-800 dark:text-gray-100">
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
            href="/contacto"
            onClick={() => setMenuOpen(false)}
            className="hover:underline"
          >
            Contacto
          </Link>
          <Link
            href="/protected"
            onClick={() => setMenuOpen(false)}
            className="hover:underline text-purple-600 dark:text-purple-400 font-medium"
          >
            Mi espacio
          </Link>
          {user ? (
            <Link
              href="/protected/profile"
              onClick={() => setMenuOpen(false)}
              className="hover:underline font-semibold"
            >
              Perfil
            </Link>
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
