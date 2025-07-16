"use client";

import { Footer } from "@/components/footer";
import { ThemeProvider } from "next-themes";
import { createBrowserClient } from "@supabase/ssr";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );

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
