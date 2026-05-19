"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Session } from "@supabase/supabase-js";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  Bars3Icon,
  XMarkIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home,
  HelpCircle,
  Gem,
  Sparkles as SparklesIcon,
  Map,
  User2,
  LogOut,
  Users,
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
  { href: "/informacion", label: "Como funciona", icon: Map },
  { href: "/protected/social", label: "Comunidad", icon: Users },
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isPanelRoute =
    pathname === "/protected" ||
    pathname?.startsWith("/protected/social") ||
    pathname?.startsWith("/protected/dia/");

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
      const scrollTop = window.scrollY;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(scrollTop > 12);
      setScrollProgress(scrollable > 0 ? scrollTop / scrollable : 0);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
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

  const headerClasses = `fixed left-0 top-0 z-50 w-full px-3 transition-all duration-500 sm:px-4 ${
    scrolled
      ? "py-2"
      : "py-3"
  }`;

  const shellClasses = `relative mx-auto flex w-full max-w-6xl items-center justify-between overflow-hidden border px-4 transition-all duration-500 sm:px-6 lg:px-8 ${
    scrolled
      ? "h-14 rounded-full border-[#d8c6ff]/65 bg-[#fffaf2]/90 shadow-[0_18px_55px_rgba(39,48,79,0.16)] backdrop-blur-2xl dark:border-[#f3c76b]/24 dark:bg-gray-950/88 dark:shadow-[0_22px_70px_rgba(0,0,0,0.38)] sm:h-16"
      : "h-16 rounded-[1.75rem] border-[#d8c6ff]/45 bg-[#fffaf2]/78 shadow-[0_14px_44px_rgba(39,48,79,0.1)] backdrop-blur-xl dark:border-[#f3c76b]/18 dark:bg-gray-950/72 sm:h-[4.75rem]"
  }`;

  if (isPanelRoute) {
    return null;
  }

  return (
    <>
    <motion.header
      className={headerClasses}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={shellClasses}>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_0%,rgba(216,198,255,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.3),rgba(255,250,242,0.06))] transition-opacity duration-500 dark:bg-[radial-gradient(circle_at_10%_0%,rgba(126,87,194,0.16),transparent_36%),linear-gradient(180deg,rgba(17,24,39,0.42),rgba(17,24,39,0.1))]" />
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-[#516fae] via-[#c89a3c] to-[#8d73b7]"
          style={{ scaleX: scrollProgress }}
          animate={{ opacity: scrolled ? 0.9 : 0 }}
          transition={{ duration: 0.25 }}
        />
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-full border border-transparent px-2 py-1 transition hover:border-[#d8c6ff]/60 hover:bg-white/55 hover:shadow-[0_12px_30px_rgba(81,111,174,0.1)] dark:hover:border-[#f3c76b]/24 dark:hover:bg-white/5"
        >
          <motion.div
            whileHover={{ rotate: 18, scale: 1.04 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={`relative grid place-items-center rounded-full bg-white shadow-[0_12px_28px_rgba(81,111,174,0.14)] ring-1 ring-[#d8c6ff]/70 transition-all duration-500 dark:bg-purple-950/70 dark:ring-[#f3c76b]/24 ${
              scrolled ? "h-10 w-10" : "h-11 w-11"
            }`}
          >
            <span className="absolute inset-0 rounded-full bg-[#c89a3c]/20 blur-md transition group-hover:bg-[#c89a3c]/30" />
            <Image
              src="/logo-estrella.png"
              alt="Estrella del Alba"
              width={36}
              height={36}
              priority
              className="relative z-10 rounded-full"
            />
          </motion.div>
          <div className="flex flex-col text-left transition-all duration-500">
            <span className={`font-semibold uppercase tracking-[0.3em] text-[#6f5aa8] transition-all duration-500 dark:text-purple-300/80 ${scrolled ? "text-xs" : "text-sm"}`}>
              Estrella
            </span>
            <span className={`-mt-1 bg-gradient-to-r from-[#516fae] via-[#8d73b7] to-[#c89a3c] bg-clip-text font-bold text-transparent transition-all duration-500 dark:from-purple-300 dark:via-pink-300 dark:to-indigo-300 ${scrolled ? "text-xs" : "text-sm"}`}>
              del Alba
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-1 rounded-full border border-white/75 bg-white/50 p-1 shadow-[0_14px_36px_rgba(81,111,174,0.08)] backdrop-blur-xl transition-colors duration-500 dark:border-[#f3c76b]/20 dark:bg-white/5">
          {desktopLinks.map((item) => {
            const isActive = matchPath(item.href);
            const Icon = item.icon;
            return (
              <motion.div key={item.href} whileHover={{ y: -2 }}>
                <Link
                  href={item.href}
                  className={`group relative overflow-hidden rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                    item.highlight
                      ? "text-[#8a6724] dark:text-[#f1d293]"
                      : "text-[#535b78] dark:text-zinc-200"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/95 shadow-sm ring-1 ring-[#d8c6ff]/80 dark:bg-purple-950/70 dark:ring-[#f3c76b]/24"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    <Icon
                      className={`h-3.5 w-3.5 ${
                        item.highlight ? "text-[#c89a3c]" : "text-[#8d73b7]"
                      }`}
                    />
                    <span>{item.label}</span>
                    {item.highlight && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#c89a3c]" />
                    )}
                  </span>
                </Link>
              </motion.div>
            );
          })}
          </div>

          <ThemeSwitcher />

          {user ? (
            <div className="relative flex items-center gap-3" ref={userMenuRef}>
              <div className="relative h-11 w-11">
                <span className="absolute inset-0 -z-10 rounded-full bg-[#c89a3c]/25 blur-md" />
                <div className="relative h-full w-full overflow-hidden rounded-full border border-white/80 bg-[#516fae]/15 shadow-inner shadow-[#516fae]/20 dark:border-purple-800/70 dark:bg-purple-950/60">
                  {avatar ? (
                    <Image
                      src={avatar}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#516fae] to-[#8d73b7] text-sm font-semibold text-white">
                      {initials}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setUserMenuOpen((prev) => !prev)}
                className="rounded-full border border-transparent p-2 text-[#516fae] transition hover:border-[#d8c6ff]/70 hover:bg-white/65 dark:text-purple-200 dark:hover:border-purple-800/60 dark:hover:bg-white/5"
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
                    className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-[#d8c6ff]/60 bg-[#fffaf2]/95 p-2 shadow-[0_24px_70px_rgba(39,48,79,0.18)] backdrop-blur-xl dark:border-purple-900/60 dark:bg-gray-950/95"
                  >
                    <div className="rounded-xl border border-white/70 bg-white/65 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f5aa8] dark:border-purple-900/50 dark:bg-white/5 dark:text-purple-200">
                      {user.email}
                    </div>
                    <Link
                      href="/protected/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#535b78] transition hover:bg-white/70 hover:text-[#516fae] dark:text-zinc-100 dark:hover:bg-white/5 dark:hover:text-purple-200"
                    >
                      <User2 className="h-4 w-4 text-[#8d73b7]" />
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
                className="inline-flex items-center gap-2 rounded-full bg-[#516fae] px-4 py-2 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(81,111,174,0.24)] transition hover:bg-[#405c98]"
              >
                <SparklesIcon className="h-4 w-4 text-[#f4d99a]" />
                Entrar
              </Link>
            </motion.div>
          )}
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <ThemeSwitcher />
          <motion.button
            onClick={() => setMenuOpen((prev) => !prev)}
            whileTap={{ scale: 0.92 }}
            className="rounded-full border border-[#d8c6ff]/65 bg-white/60 p-2 text-[#516fae] shadow-sm transition hover:bg-white dark:border-[#f3c76b]/24 dark:bg-white/5 dark:text-purple-200 dark:hover:bg-white/10"
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
            className="border-t border-[#d8c6ff]/55 bg-[#fffaf2]/95 shadow-[0_22px_55px_rgba(81,111,174,0.14)] backdrop-blur-xl dark:border-purple-900/50 dark:bg-gray-950/95 lg:hidden"
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
                      className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
                        isActive
                          ? "bg-white/80 text-[#516fae] shadow-sm ring-1 ring-[#d8c6ff]/65 dark:bg-white/10 dark:text-purple-200 dark:ring-purple-900/70"
                          : "text-[#535b78] hover:bg-white/60 hover:text-[#516fae] dark:text-zinc-100 dark:hover:bg-white/5 dark:hover:text-purple-200"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          item.highlight ? "text-[#c89a3c]" : "text-[#8d73b7]"
                        }`}
                      />
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="mt-4 border-t border-[#d8c6ff]/55 pt-4 dark:border-purple-900/50">
                {user ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <Link
                        href="/protected/profile"
                        className="flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-[#535b78] transition hover:bg-white/60 hover:text-[#516fae] dark:text-zinc-100 dark:hover:bg-white/5 dark:hover:text-purple-200"
                      >
                        <User2 className="h-5 w-5 text-[#8d73b7]" />
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
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-900/30"
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
                      className="flex items-center gap-3 rounded-2xl bg-[#516fae] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_16px_34px_rgba(81,111,174,0.24)] transition hover:bg-[#405c98]"
                    >
                      <SparklesIcon className="h-5 w-5 text-[#f4d99a]" />
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
    <div aria-hidden="true" className="h-16 shrink-0 sm:h-[4.75rem]" />
    </>
  );
}
