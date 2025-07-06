//C:\estrella\components\Navbar.tsx
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
  const [scrolled, setScrolled] = useState(false);
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

  // Detectar scroll para efecto de navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-lg border-b border-zinc-200/50 dark:border-zinc-800/50"
          : "bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo con animación */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <Image
              src="/logo-estrella.png"
              alt="Logo"
              width={32}
              height={32}
              priority
              className="transition-all duration-300 group-hover:drop-shadow-lg"
            />
          </motion.div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-400 dark:to-purple-600 bg-clip-text text-transparent transition-all duration-300">
            Estrella del Alba
          </span>
        </Link>

        {/* Menú de escritorio */}
        <nav className="hidden sm:flex items-center gap-8 text-sm">
          {[
            { href: "/informacion", label: "Sobre el curso" },
            { href: "/preguntas", label: "Preguntas" },
            { href: "/protected", label: "Mi espacio", highlight: true },
          ].map((item) => (
            <motion.div key={item.href} whileHover={{ y: -2 }}>
              <Link
                href={item.href}
                className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${
                  item.highlight
                    ? "text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-50 dark:hover:bg-purple-950/30"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                {item.label}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-purple-600 dark:bg-purple-400"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}

          {user ? (
            <div className="relative" ref={userMenuRef}>
              <motion.button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center text-xs font-bold overflow-hidden shadow-lg ring-2 ring-purple-600/20 transition-all duration-300 hover:ring-purple-600/40"
              >
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  initials
                )}
              </motion.button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                  >
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-b border-zinc-200 dark:border-zinc-700">
                      <p className="text-sm font-medium text-zinc-800 dark:text-white truncate">
                        {user.email}
                      </p>
                    </div>
                    <motion.div
                      whileHover={{
                        backgroundColor: "rgba(139, 92, 246, 0.1)",
                      }}
                    >
                      <Link
                        href="/protected/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-3 text-sm text-zinc-800 dark:text-white hover:bg-purple-50 dark:hover:bg-zinc-700 transition-colors duration-200"
                      >
                        👤 Perfil
                      </Link>
                    </motion.div>
                    <motion.button
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await supabase.auth.signOut();
                        router.push("/");
                      }}
                      whileHover={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                      className="w-full text-left px-4 py-3 text-sm text-zinc-800 dark:text-white hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200 border-t border-zinc-200 dark:border-zinc-700"
                    >
                      🚪 Cerrar sesión
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/login"
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Entrar
              </Link>
            </motion.div>
          )}

          <ThemeSwitcher />
        </nav>

        {/* Botón hamburguesa para móvil */}
        <div className="sm:hidden flex items-center gap-3">
          <ThemeSwitcher />
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-lg text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
            aria-label="Menú móvil"
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <XMarkIcon className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bars3Icon className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Menú móvil */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
          >
            <div className="px-4 py-4 space-y-3">
              {[
                { href: "/informacion", label: "Sobre el curso", icon: "📚" },
                { href: "/preguntas", label: "Preguntas", icon: "❓" },
                {
                  href: "/protected",
                  label: "Mi espacio",
                  icon: "🏠",
                  highlight: true,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      item.highlight
                        ? "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 font-semibold"
                        : "text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-3 mt-3">
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Link
                        href="/protected/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-200"
                      >
                        <span className="text-lg">👤</span>
                        Perfil
                      </Link>
                    </motion.div>
                    <motion.button
                      onClick={async () => {
                        setMenuOpen(false);
                        await supabase.auth.signOut();
                        router.push("/");
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-200"
                    >
                      <span className="text-lg">🚪</span>
                      Cerrar sesión
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      href="/auth/login"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
                    >
                      <span className="text-lg">🔐</span>
                      Inicia sesión
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
