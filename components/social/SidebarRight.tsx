"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function SidebarRight() {
  return (
    <div className="space-y-6">
      <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-base">Proximos hitos</CardTitle>
          <CardDescription>Pasos para sostener tu proceso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>- Publica una reflexion diaria</p>
          <p>- Responde a las notas de otras personas</p>
          <p>- Guarda tus momentos clave</p>
        </CardContent>
      </Card>
    </div>
  );
}
