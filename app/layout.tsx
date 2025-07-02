// app/layout.tsx
"use client";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/footer";
import "./globals.css";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [supabase] = useState(() => createBrowserSupabaseClient());

  return (
    <html lang="es" suppressHydrationWarning className="overflow-x-hidden">
      <body className={`${geistSans.className} antialiased overflow-x-hidden`}>
        <SessionContextProvider supabaseClient={supabase}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
          </ThemeProvider>
          <Footer />
        </SessionContextProvider>
      </body>
    </html>
  );
}
