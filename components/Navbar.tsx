"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButton } from "@/components/auth-button";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white dark:bg-black border-b border-zinc-200 dark:border-zinc-800 relative z-50">
      <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
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

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-700 dark:text-gray-300">
          <Link href="/about" className="hover:underline">
            Sobre el curso
          </Link>
          <Link href="/faq" className="hover:underline">
            Preguntas
          </Link>
          <Link href="/contact" className="hover:underline">
            Contacto
          </Link>
          <Link
            href="/protected"
            className="hover:underline font-medium text-purple-600 dark:text-purple-400"
          >
            Mi espacio
          </Link>
          <ThemeSwitcher />
          <AuthButton />
        </nav>

        {/* Mobile menu toggle */}
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

      {/* Mobile menu animado */}
      <div
        className={`sm:hidden absolute top-16 left-0 w-full transition-all duration-300 ease-in-out overflow-hidden bg-white dark:bg-black border-t border-zinc-200 dark:border-zinc-700 ${
          menuOpen
            ? "opacity-100 translate-y-0 max-h-[500px] py-4 px-4"
            : "opacity-0 -translate-y-2 max-h-0 py-0 px-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-3 text-sm text-gray-800 dark:text-gray-100">
          <Link
            href="/about"
            onClick={() => setMenuOpen(false)}
            className="hover:underline"
          >
            Sobre el curso
          </Link>
          <Link
            href="/faq"
            onClick={() => setMenuOpen(false)}
            className="hover:underline"
          >
            Preguntas
          </Link>
          <Link
            href="/contact"
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
          <div className="mt-2">
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}
