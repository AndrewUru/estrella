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
          <CardTitle className="text-base">Próximos hitos</CardTitle>
          <CardDescription>Pasos para sostener tu proceso</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Publica una reflexión diaria 🌞</p>
          <p>• Reacciona a las notas de otras almas 🌿</p>
          <p>• Guarda tus momentos clave 💎</p>
        </CardContent>
      </Card>
    </div>
  );
}
