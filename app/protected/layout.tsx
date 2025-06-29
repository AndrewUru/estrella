"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.replace("/auth/login");
      }
    };
    checkSession();
  }, [router]);

  return (
    <main className="min-h-screen w-full flex flex-col bg-background text-foreground">
      <Navbar />
      <section className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        {/* NAVBAR */}
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
