"use client";
import { Home, Sparkles, Users, Bookmark } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function SidebarLeft() {
  const links = [
    { label: "Inicio", icon: <Home />, href: "/protected" },
    { label: "Prácticas", icon: <Sparkles />, href: "#", disabled: true },
    { label: "Círculos en vivo", icon: <Users />, href: "#", disabled: true },
    { label: "Guardados", icon: <Bookmark />, href: "#", disabled: true },
  ];

  return (
    <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur">
      <CardHeader>
        <CardTitle className="text-base">Navegación</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              l.disabled
                ? "opacity-60 cursor-not-allowed"
                : "hover:bg-primary/10"
            }`}
          >
            <span className="text-primary">{l.icon}</span>
            {l.label}
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
