"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Laptop, Moon, Sparkles, Sun } from "lucide-react";

const ICON_SIZE = 16;

const themeOptions = [
  {
    value: "light" as const,
    label: "Luz del alba",
    description: "Colores claros y suaves para rituales matutinos.",
    Icon: Sun,
  },
  {
    value: "dark" as const,
    label: "Noche estelar",
    description: "Oscuridad protectora para meditar con calma.",
    Icon: Moon,
  },
  {
    value: "system" as const,
    label: "Fluir con el sistema",
    description: "Sincroniza la app con el ritmo de tu dispositivo.",
    Icon: Laptop,
  },
];

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = useMemo(() => {
    if (!mounted) return themeOptions[0];
    const currentValue = (theme ??
      resolvedTheme ??
      "light") as (typeof themeOptions)[number]["value"];
    return (
      themeOptions.find((option) => option.value === currentValue) ??
      themeOptions[0]
    );
  }, [mounted, theme, resolvedTheme]);

  if (!mounted) {
    return null;
  }

  const { Icon } = activeTheme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="Cambiar tema visual"
          className="group relative flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-pink-500/15 px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition hover:scale-[1.02] hover:border-purple-300/40 hover:bg-purple-500/20 focus-visible:ring-2 focus-visible:ring-purple-300"
        >
          <span className="absolute inset-x-2 -bottom-1 h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent transition-opacity group-hover:opacity-100" />
          <Icon size={ICON_SIZE} className="text-purple-200 drop-shadow" />
          <span className="hidden text-[11px] uppercase tracking-[0.18em] text-black-700 sm:inline">
            {activeTheme.label}
          </span>
          <Sparkles className="h-3.5 w-3.5 text-purple-200/80 transition-transform duration-500 group-hover:rotate-12" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-2xl border border-purple-500/30 bg-gradient-to-b from-gray-950 via-gray-900 to-purple-950/80 p-2 shadow-[0_18px_40px_rgba(124,58,237,0.35)] backdrop-blur"
      >
        <DropdownMenuLabel className="flex flex-col gap-1 text-xs font-semibold uppercase tracking-[0.25em] text-purple-200">
          Ajustar tema
          <span className="text-[10px] font-normal uppercase tracking-[0.35em] text-purple-300/70">
            elige la energia del momento
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 h-px bg-purple-500/30" />
        <DropdownMenuRadioGroup
          value={theme ?? resolvedTheme ?? "light"}
          onValueChange={(value) => setTheme(value)}
        >
          {themeOptions.map(
            ({ value, label, description, Icon: OptionIcon }) => (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                className="group flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm text-purple-50 data-[state=checked]:bg-white/10 data-[state=checked]:shadow-inner"
              >
                <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-purple-200">
                  <OptionIcon size={ICON_SIZE} />
                </div>
                <div className="flex flex-col gap-0.5 text-left">
                  <span className="font-semibold text-purple-50">{label}</span>
                  <span className="text-xs text-purple-200/70">
                    {description}
                  </span>
                </div>
              </DropdownMenuRadioItem>
            )
          )}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator className="my-2 h-px bg-purple-500/20" />
        <DropdownMenuItem className="text-[11px] uppercase tracking-[0.2em] text-purple-200/70 focus:bg-transparent">
          {activeTheme.value === "system"
            ? "Siguiendo el pulso del dispositivo"
            : "Sincronizado con tu eleccion"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { ThemeSwitcher };
