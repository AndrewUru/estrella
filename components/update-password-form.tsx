"use client";

import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/protected");
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "OcurriÃ³ un problema al actualizar tu contraseÃ±a"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex w-full max-w-md flex-col gap-6 rounded-3xl bg-card/70 p-6 shadow-lg backdrop-blur-sm",
        className
      )}
      {...props}
    >
      <Card className="border border-border bg-card/80 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-primary">
            Actualiza tu contrasena
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Ingresa una nueva contrasena segura para proteger tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handlePasswordUpdate}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Nueva contrasena
              </Label>
              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Ingresa tu nueva contrasena"
                  required
                  value={password}
                  className="border-border bg-background text-foreground focus-visible:ring-primary"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Debe tener al menos 8 caracteres e incluir numeros y letras.
                </p>
              </div>
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar nueva contraseÃ±a"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

