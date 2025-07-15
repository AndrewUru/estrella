// components/Footer.tsx
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden mt-16">
      {/* Background decorativo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-primary/10 pointer-events-none"></div>

      {/* Línea superior con gradiente */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

      <div className="relative bg-card/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Contenido principal del footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Columna 1: Sobre Estrella del Alba */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Estrella del Alba
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Tu camino de transformación espiritual comienza aquí. Reconecta
                con tu esencia más profunda y despierta tu poder interior.
              </p>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">
                  Transformación • Conexión • Despertar
                </span>
              </div>
            </div>

            {/* Columna 2: Navegación */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Navegación
              </h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Inicio
                </Link>
                <Link
                  href="/informacion"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Información
                </Link>
                <Link
                  href="/protected"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Mi Transformación
                </Link>
              </nav>
            </div>

            {/* Columna 3: Recursos */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Recursos
              </h3>
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/privacidad"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Política de Privacidad
                </Link>
                <Link
                  href="/terminos"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Términos de Uso
                </Link>
                <Link
                  href="/contacto"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Contacto
                </Link>
                <Link
                  href="/informacion"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-300"
                >
                  Preguntas Frecuentes
                </Link>
              </nav>
            </div>

            {/* Columna 4: Conexión */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">
                Conexión
              </h3>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Únete a nuestra comunidad de almas en transformación.
                </p>
                <div className="flex items-center gap-3">
                  <ThemeSwitcher />
                  <span className="text-xs text-muted-foreground">Tema</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>📧 Soporte: Marketing@samariluz.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-6"></div>

          {/* Footer inferior */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p className="text-center sm:text-left">
                Con amor creado por{" "}
                <a
                  href="https://samariluz.com"
                  target="_blank"
                  className="group relative font-semibold text-primary hover:text-primary/80 transition-all duration-300"
                  rel="noreferrer"
                >
                  <span className="relative z-10">Samari Luz</span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary/30 group-hover:w-full transition-all duration-300"></span>
                </a>{" "}
                y{" "}
                <a
                  href="https://elsaltoweb.es/"
                  target="_blank"
                  className="group relative font-semibold text-primary hover:text-primary/80 transition-all duration-300"
                  rel="noreferrer"
                >
                  <span className="relative z-10">ElSaltoweb.es</span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary/30 group-hover:w-full transition-all duration-300"></span>
                </a>
              </p>
              <div className="hidden sm:block w-px h-4 bg-border/50"></div>
              <span className="text-center sm:text-left">
                © {new Date().getFullYear()} Estrella del Alba. Todos los
                derechos reservados.
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <span className="opacity-75">Versión 1.0</span>
              <div className="w-px h-4 bg-border/50"></div>
              <span className="opacity-75">Hecho con ✨ y 💜</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decoración inferior */}
      <div className="h-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20"></div>
    </footer>
  );
}
