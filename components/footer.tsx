import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function Footer() {
  return (
    <footer className="w-full flex flex-col sm:flex-row items-center justify-between border-t border-border/50 bg-card/30 backdrop-blur-sm px-6 py-10 text-xs text-muted-foreground gap-4 sm:gap-8 mt-20">
      <p className="text-center sm:text-left">
        Con amor creado por{" "}
        <a
          href="https://elsaltoweb.es/"
          target="_blank"
          className="font-semibold text-primary hover:underline transition-colors"
          rel="noreferrer"
        >
          ElSaltoweb.es
        </a>{" "}
        y{" "}
        <a
          href="https://samariluz.com"
          target="_blank"
          className="font-semibold text-primary hover:underline transition-colors"
          rel="noreferrer"
        >
          Samari Luz
        </a>
        . Todos los derechos reservados © {new Date().getFullYear()}
      </p>

      <div className="flex items-center gap-4">
        <Link
          href="/privacidad"
          className="hover:underline hover:text-foreground"
        >
          Privacidad
        </Link>
        <Link
          href="/contacto"
          className="hover:underline hover:text-foreground"
        >
          Contacto
        </Link>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}
