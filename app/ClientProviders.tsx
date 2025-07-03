// app/ClientProviders.tsx
"use client";

import { Footer } from "@/components/footer";
import { ThemeProvider } from "next-themes";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";

import { SessionContextProvider } from "@supabase/auth-helpers-react";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createPagesBrowserClient();

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Footer />
      </ThemeProvider>
    </SessionContextProvider>
  );
}
