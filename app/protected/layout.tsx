import Link from "next/link";
import Image from "next/image";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <nav className="border-b border-muted h-16 flex items-center justify-between px-6 shadow-sm bg-card">
        <div className="flex items-center gap-3">
          <Image
            src="/logo-estrella.png"
            alt="Estrella del Alba"
            width={40}
            height={40}
            priority
          />
          <Link href="/protected">
            <span className="text-xl font-semibold tracking-tight text-primary">
              Estrella del Alba
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <AuthButton />
        </div>
      </nav>

      <section className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        {children}
      </section>

      <footer className="w-full py-6 border-t border-muted text-center text-sm text-muted-foreground bg-muted">
        <p>
          &copy; {new Date().getFullYear()} Estrella del Alba. Todos los
          derechos reservados.
        </p>
      </footer>
    </main>
  );
}
