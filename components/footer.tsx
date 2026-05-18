import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Heart, Mail, Sparkles } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/informacion", label: "Como funciona" },
  { href: "/protected/social", label: "Comunidad" },
  { href: "/preguntas", label: "Preguntas" },
  { href: "/upgrade", label: "Planes" },
  { href: "/protected", label: "Mi espacio" },
];

const resourceLinks = [
  { href: "/privacidad", label: "Privacidad" },
  { href: "/terminos", label: "Terminos" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-20 w-full overflow-hidden border-t border-[#d8c6ff]/45 bg-[#fffaf2] text-[#535b78] dark:border-purple-900/50 dark:bg-gray-950 dark:text-zinc-300">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c89a3c]/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(216,198,255,0.34),transparent_32%),radial-gradient(circle_at_82%_35%,rgba(200,154,60,0.18),transparent_28%)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(126,87,194,0.22),transparent_34%),radial-gradient(circle_at_82%_35%,rgba(200,154,60,0.12),transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr_1fr_1.1fr]">
          <div className="space-y-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_14px_35px_rgba(81,111,174,0.14)] ring-1 ring-[#d8c6ff]/70 dark:bg-purple-950/70 dark:ring-purple-800/70">
                <span className="absolute inset-0 rounded-full bg-[#c89a3c]/20 blur-md" />
                <Image
                  src="/logo-estrella.png"
                  alt="Estrella del Alba"
                  width={40}
                  height={40}
                  className="relative rounded-full"
                />
              </span>
              <span className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6f5aa8] dark:text-purple-300/80">
                  Estrella
                </span>
                <span className="-mt-0.5 bg-gradient-to-r from-[#516fae] via-[#8d73b7] to-[#c89a3c] bg-clip-text text-base font-bold text-transparent dark:from-purple-300 dark:via-pink-300 dark:to-indigo-300">
                  del Alba
                </span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-7 text-[#5f6680] dark:text-zinc-400">
              Un espacio luminoso para sostener tu practica diaria, reconectar
              con tu energia y volver a tu centro con calma.
            </p>

            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8c6ff]/70 bg-white/65 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6f5aa8] shadow-sm backdrop-blur dark:border-purple-800/60 dark:bg-white/5 dark:text-purple-200">
              <Sparkles className="h-4 w-4 text-[#c89a3c]" />
              Practica, comunidad y claridad
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#27304f] dark:text-zinc-100">
              Explorar
            </h2>
            <nav className="mt-4 grid gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex w-fit items-center gap-2 text-sm text-[#5f6680] transition hover:text-[#516fae] dark:text-zinc-400 dark:hover:text-purple-200"
                >
                  <span className="h-px w-4 bg-[#c89a3c]/55 transition group-hover:w-6" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-[#27304f] dark:text-zinc-100">
              Recursos
            </h2>
            <nav className="mt-4 grid gap-2">
              {resourceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex w-fit items-center gap-2 text-sm text-[#5f6680] transition hover:text-[#516fae] dark:text-zinc-400 dark:hover:text-purple-200"
                >
                  <span className="h-px w-4 bg-[#c89a3c]/55 transition group-hover:w-6" />
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-[#27304f] dark:text-zinc-100">
              Conexion
            </h2>
            <a
              href="mailto:Marketing@samariluz.com"
              className="inline-flex items-center gap-3 rounded-2xl border border-white/80 bg-white/62 px-4 py-3 text-sm font-medium text-[#516fae] shadow-[0_14px_35px_rgba(81,111,174,0.09)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-purple-900/50 dark:bg-white/5 dark:text-purple-200 dark:hover:bg-white/10"
            >
              <Mail className="h-4 w-4 text-[#c89a3c]" />
              Marketing@samariluz.com
            </a>

            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <span className="text-sm text-[#5f6680] dark:text-zinc-400">
                Ajustar tema
              </span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-[#d8c6ff]/55 pt-6 text-xs text-[#777088] dark:border-purple-900/50 dark:text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{year} Estrella del Alba. Todos los derechos reservados.</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-[#c89a3c]" />
              Creado por{" "}
              <a
                href="https://samariluz.com"
                target="_blank"
                className="inline-flex items-center gap-1 font-semibold text-[#516fae] transition hover:text-[#405c98] dark:text-purple-200 dark:hover:text-purple-100"
                rel="noreferrer"
              >
                Samari Luz
                <ExternalLink className="h-3 w-3" />
              </a>
            </span>
            <span className="hidden h-4 w-px bg-[#d8c6ff] dark:bg-purple-900 sm:block" />
            <a
              href="https://elsaltoweb.es/"
              target="_blank"
              className="inline-flex items-center gap-1 font-semibold text-[#516fae] transition hover:text-[#405c98] dark:text-purple-200 dark:hover:text-purple-100"
              rel="noreferrer"
            >
              ElSaltoweb.es
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
