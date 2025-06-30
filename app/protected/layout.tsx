import { Navbar } from "@/components/Navbar";
import { ClientWrapper } from "./client-wrapper";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen w-full flex flex-col bg-background text-foreground">
      <Navbar />
      <ClientWrapper>
        <section className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
          {children}
        </section>
      </ClientWrapper>
      <footer className="w-full py-6 border-t border-muted text-center text-sm text-muted-foreground bg-muted">
        <p>
          &copy; {new Date().getFullYear()} Estrella del Alba. Todos los
          derechos reservados.
        </p>
      </footer>
    </main>
  );
}
