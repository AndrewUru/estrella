// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import { Navbar } from "@/components/Navbar";
import { CookieConsent } from "@/components/CookieConsent";
import { Session } from "@supabase/supabase-js";
import BotonInstalarPWA from "@/components/BotonInstalarPWA";

export const metadata: Metadata = {
  title: "Estrella del Alba",
  description:
    "Una plataforma para acompañar tu evolución diaria. Crea hábitos, sigue tu progreso y transforma tu constancia.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

type LayoutProps = {
  session: Session | null;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <html lang="es" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#c084fc" />
      </head>
      <body className={`${geistSans.className} antialiased overflow-x-hidden`}>
        <ClientProviders>
          <Navbar />
          {children}
          <BotonInstalarPWA />
          <CookieConsent />
        </ClientProviders>
      </body>
    </html>
  );
};

export default Layout;
