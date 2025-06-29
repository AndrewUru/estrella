// components/navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";

export const Navbar = () => (
  <nav className="w-full flex justify-center border-b border-border/50 h-16 bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
    <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
      <div className="flex gap-5 items-center font-semibold text-primary">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo-estrella.png"
            alt="Logo Estrella del Alba"
            width={32}
            height={32}
          />
          <span className="text-base hidden sm:inline">Estrella del Alba</span>
        </Link>
      </div>
      <div className="hidden md:flex gap-6 items-center text-muted-foreground text-sm">
        <Link href="/" className="hover:text-primary transition-colors">
          Inicio
        </Link>
        <Link
          href="/informacion"
          className="hover:text-primary transition-colors"
        >
          Información
        </Link>
        <Link
          href="/protected"
          className="hover:text-primary transition-colors"
        >
          Mi Transformación
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {!hasEnvVars ? <EnvVarWarning /> : <AuthButton />}
        <ThemeSwitcher />
      </div>
    </div>
  </nav>
);
