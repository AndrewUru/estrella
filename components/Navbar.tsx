"use client";

import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 transition-transform hover:scale-105"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-0.5">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-background">
                <Image
                  src="/logo-estrella.png"
                  alt="Estrella del Alba Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
            </div>
            <span className="hidden text-xl font-bold text-foreground sm:block">
              Estrella del Alba
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50 group"
            >
              Inicio
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8"></span>
            </Link>
            <Link
              href="/informacion"
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50 group"
            >
              Información
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8"></span>
            </Link>
            <Link
              href="/protected"
              className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground rounded-md hover:bg-muted/50 group"
            >
              Mi Transformación
              <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-3/4 group-hover:left-1/8"></span>
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeSwitcher />
            <AuthButton />
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <div className="md:hidden flex items-center space-x-2">
              <ThemeSwitcher />
              <AuthButton />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
