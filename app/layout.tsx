// app/layout.tsx
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import { Navbar } from "@/components/Navbar";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${geistSans.className} antialiased overflow-x-hidden`}>
        <ClientProviders>
          <Navbar />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
