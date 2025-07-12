// C:\estrella\app\auth\sign-up-success\page.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-white/10 bg-gradient-to-br from-background/80 to-muted/40 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-purple-500/10 p-3 rounded-full border border-purple-500/30">
                <Sparkles className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              ¡Tu cuenta está lista!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Ya puedes comenzar tu viaje interior 🌟
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Te hemos registrado correctamente. Pulsa el botón para acceder a tu espacio sagrado.
            </p>
            <Link
              href="/protected"
              className="inline-block bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition"
            >
              Ir al Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
