//C:\estrella\app\protected\layout.tsx
import { ClientWrapper } from "./client-wrapper";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground">
      <ClientWrapper>
        <section className="flex-1 w-full mx-auto">{children}</section>
      </ClientWrapper>
    </main>
  );
}
