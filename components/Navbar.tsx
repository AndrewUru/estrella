// components/Navbar.tsx
import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export async function Navbar() {
  return (
    <nav className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 py-3 text-sm relative">
        {/* Input checkbox para controlar el menú móvil */}
        <input id="menu-toggle" type="checkbox" className="peer hidden" />

        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-primary hover:opacity-80 transition-opacity"
          >
            <Image
              src="/logo-estrella.png"
              alt="Logo Estrella del Alba"
              width={32}
              height={32}
            />
            <span className="text-base hidden sm:inline">
              Estrella del Alba
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-6 items-center text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Inicio
            </Link>
            <Link href="/informacion" className="hover:text-primary">
              Información
            </Link>
            <Link href="/protected" className="hover:text-primary">
              Mi Transformación
            </Link>
            <AuthButton />
            <ThemeSwitcher />
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <label
              htmlFor="menu-toggle"
              className="cursor-pointer text-xl select-none hover:opacity-70 transition-opacity"
            >
              ☰
            </label>
          </div>
        </div>

        {/* Mobile menu - Ahora es hermano del input checkbox */}
        <div className="peer-checked:flex hidden flex-col gap-4 mt-4 md:hidden text-muted-foreground text-sm border-t border-border pt-4">
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
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <AuthButton />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
