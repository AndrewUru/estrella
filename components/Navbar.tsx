"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Bars3Icon, XMarkIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  HelpCircle,
  Gem,
  Sparkles as SparklesIcon,
  Map,
  User2,
  LogOut,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavLink = {
  href: string;
  label: string;
  icon: LucideIcon;
  highlight?: boolean;
};

const navLinks: NavLink[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/informacion", label: "Como funciona?", icon: Map },
  { href: "/preguntas", label: "Preguntas", icon: HelpCircle },
  { href: "/upgrade", label: "Planes", icon: Gem, highlight: true },
  { href: "/protected", label: "Mi espacio", icon: SparklesIcon },
];

export function Navbar() {
  const [session, setSession] = useState<Session | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const user = session?.user;
  const avatar = avatarUrl || user?.user_metadata?.avatar_url;
  const initials = useMemo(
    () => user?.email?.slice(0, 2)?.toUpperCase() ?? "",
    [user?.email]
  );

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data } = await supabase.auth.getSession();
      const currentSession = data.session;
      setSession(currentSession);

      if (currentSession?.user) {
        fetchAvatar(currentSession.user.id);
      }
    };

    getSessionAndProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
        if (nextSession?.user) {
          fetchAvatar(nextSession.user.id);
        } else {
          setAvatarUrl(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const fetchAvatar = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error cargando avatar desde perfiles:", error.message);
      return;
    }

    if (data?.avatar_url) {
      setAvatarUrl(data.avatar_url);
    }
  };

  const desktopLinks = navLinks.filter((link) => link.href !== "/");
  const mobileLinks = navLinks;

  const matchPath = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href) ?? false;
  };

  const headerClasses = `sticky top-0 z-50 w-full border-b transition-all duration-300 ${
    scrolled
      ? "bg-white/80 dark:bg-gray-950/85 backdrop-blur-xl border-white/30 dark:border-purple-900/40 shadow-[0_16px_45px_rgba(124,58,237,0.22)]"
      : "bg-transparent border-transparent"
  }`;

  return (
    <motion.header
      className={headerClasses}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-full bg-gradient-to-b from-purple-500/10 via-white/0 to-transparent dark:from-purple-900/35" />
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 rounded-full px-2 py-1 transition hover:scale-[1.02]">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/50 to-pink-500/40 blur-md" />
            <Image
              src="/logo-estrella.png"
              alt="Estrella del Alba"
              width={38}
              height={38}
              priority
              className="relative z-10 rounded-full"
            />
          </motion.div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-purple-500/80 dark:text-purple-300/80">
              Estrella
            </span>
            <span className="-mt-1 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 bg-clip-text text-base font-bold text-transparent dark:from-purple-300 dark:via-pink-300 dark:to-indigo-300">
              del Alba
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {desktopLinks.map((item) => {
            const isActive = matchPath(item.href);
            return (
              <motion.div key={item.href} whileHover={{ y: -2 }}>
                <Link
                  href={item.href}
                  className={`group relative overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition ${
                    item.highlight
                      ? "text-purple-600 dark:text-purple-300"
                      : "text-zinc-700 dark:text-zinc-200"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-purple-500/20 via-purple-500/10 to-transparent dark:from-purple-500/40 dark:via-pink-500/20"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <span>{item.label}</span>
                    <span className="h-[2px] w-6 rounded-full bg-gradient-to-r from-purple-500/40 to-pink-500/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </span>
                </Link>
              </motion.div>
            );
          })}

          <ThemeSwitcher />

          {user ? (
            <div className="relative flex items-center gap-3" ref={userMenuRef}>
              <div className="relative h-11 w-11">
                <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-purple-500/60 via-pink-500/40 to-indigo-500/40 blur" />
                <div className="relative h-full w-full overflow-hidden rounded-full border border-purple-400/40 bg-purple-500/20 shadow-inner shadow-purple-500/30">
                  {avatar ? (
                    <Image src={avatar} alt="Avatar" fill className="object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-sm font-semibold text-white">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="rounded-full p-2 text-purple-600 transition hover:bg-purple-50 dark:text-purple-200 dark:hover:bg-purple-950/40"
                aria-label="Abrir menu de cuenta"
              >
                <Cog6ToothIcon className="h-5 w-5" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-14 w-60 overflow-hidden rounded-2xl border border-purple-200/40 bg-gradient-to-br from-white/95 via-white/90 to-purple-50/90 p-2 shadow-xl dark:from-gray-950/95 dark:via-gray-950/90 dark:to-purple-950/80"
                  >
                    <div className="rounded-xl bg-purple-500/10 px-4 py-3 text-xs uppercase tracking-[0.2em] text-purple-500 dark:text-purple-200">
                      {user.email}
                    </div>
                    <Link
                      href="/protected/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-purple-500/10 dark:text-zinc-100 dark:hover:bg-purple-900/40"
                    >
                      <User2 className="h-4 w-4 text-purple-500" />
                      Ver perfil
                    </Link>
                    <button
                      onClick={async () => {
                        setUserMenuOpen(false);
                        await supabase.auth.signOut();
                        router.push("/");
                      }}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesion
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/auth/login"
                className="rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-purple-500/40"
              >
                Entrar
              </Link>
            </motion.div>
          )}
        </nav>

        <div className="flex items-center gap-3 sm:hidden">
          <ThemeSwitcher />
          <motion.button
            onClick={() => setMenuOpen((prev) => !prev)}
            whileTap={{ scale: 0.92 }}
            className="rounded-xl p-2 text-zinc-700 transition hover:bg-purple-50 dark:text-zinc-200 dark:hover:bg-purple-950/40"
            aria-label="Abrir menu principal"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bars3Icon className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="sm:hidden border-t border-purple-200/30 bg-white/95 shadow-lg backdrop-blur dark:border-purple-900/40 dark:bg-gray-950/95"
          >
            <div className="space-y-3 px-4 py-6">
              {mobileLinks.map((item, index) => {
                const Icon = item.icon;
                const isActive = matchPath(item.href);
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.08 }}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium transition ${
                        isActive
                          ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-200"
                          : "text-zinc-700 hover:bg-purple-500/10 dark:text-zinc-100 dark:hover:bg-purple-900/30"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="mt-4 border-t border-purple-200/30 pt-4 dark:border-purple-900/40">
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Link
                        href="/protected/profile"
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-zinc-700 transition hover:bg-purple-500/10 dark:text-zinc-100 dark:hover:bg-purple-900/30"
                      >
                        <User2 className="h-5 w-5 text-purple-500" />
                        Ver perfil
                      </Link>
                    </motion.div>
                    <motion.button
                      onClick={async () => {
                        setMenuOpen(false);
                        await supabase.auth.signOut();
                        router.push("/");
                      }}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.43 }}
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold text-red-500 transition hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-900/30"
                    >
                      <LogOut className="h-5 w-5" />
                      Cerrar sesion
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:shadow-purple-500/40"
                    >
                      <SparklesIcon className="h-5 w-5" />
                      Iniciar sesion
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
