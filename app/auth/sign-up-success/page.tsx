import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border border-white/10 bg-gradient-to-br from-background/80 to-muted/40 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="bg-green-500/10 p-3 rounded-full border border-green-500/30">
                <MailCheck className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              ¡Gracias por registrarte!
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Te enviamos un correo de confirmación
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Por favor, revisa tu bandeja de entrada (o la carpeta de spam) y
              confirma tu cuenta antes de iniciar sesión.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
