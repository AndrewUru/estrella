import { Suspense } from "react";

import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Fondo animado con gradientes */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 dark:from-primary/10 dark:to-accent/20"></div>
        
        {/* Elementos decorativos flotantes */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-accent/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-lg animate-pulse delay-500"></div>
        
        {/* Patrón de puntos sutil */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10" 
             style={{
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
               backgroundSize: '20px 20px'
             }}>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-2">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden backdrop-blur-sm bg-card/60 dark:bg-card/40 border border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
          
          {/* Columna izquierda - Inspiracional */}
          <div className="hidden lg:flex flex-col justify-center items-start p-12 xl:p-16 relative overflow-hidden">
            {/* Fondo con gradiente mejorado */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent dark:from-primary/20 dark:via-accent/15 dark:to-primary/5"></div>
          
                        
            <div className="relative z-10 space-y-8">
              <div className="space-y-6">
                <h2 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text text-transparent">
                  Reconecta con tu{" "}
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-extrabold">
                      alma
                    </span>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent rounded-full opacity-60"></div>
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"></div>
                  </span>
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed max-w-md font-medium">
                  En solo 7 días, despierta tu 
                  <span className="text-primary font-semibold"> claridad energética</span>, 
                  <span className="text-accent font-semibold"> propósito espiritual</span> y 
                  <span className="text-primary font-semibold"> dones intuitivos</span>.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: "🌟", text: "Acceso inmediato a prácticas vibracionales", color: "text-yellow-500" },
                  { icon: "🎧", text: "Playlist ceremonial para tu viaje interior", color: "text-purple-500" },
                  { icon: "📓", text: "PDF para acompañar tu proceso", color: "text-blue-500" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-2xl bg-background/30 backdrop-blur-sm border border-border/30 hover:bg-background/50 transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-200">
                      <span className="text-lg">{item.icon}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha - Login */}
          <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-4 space-y-10 w-full relative">
            {/* Fondo sutil para el formulario */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/60 dark:from-background/60 dark:to-background/40"></div>
            
            <div className="relative z-10 space-y-10">
              {/* Header mejorado */}

              {/* Formulario con Suspense */}
              <div className="bg-background/40 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-lg">
                <Suspense
                  fallback={
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 mb-4 animate-pulse">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <p className="text-primary font-medium animate-pulse">
                        Preparando tu experiencia...
                      </p>
                    </div>
                  }
                >
                  <LoginContent />
                </Suspense>
              </div>

              {/* Footer mejorado */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/30">
                  <span className="text-sm text-muted-foreground mr-2">¿Primera vez aquí?</span>
                  <a
                    href="/auth/register"
                    className="text-sm font-semibold text-primary hover:text-accent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-lg px-2 py-1"
                    aria-label="Crear una nueva cuenta"
                  >
                    Crea tu cuenta →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Versión móvil del contenido inspiracional */}
      <div className="lg:hidden relative z-10 px-4 pb-8">
        <div className="max-w-md mx-auto text-center space-y-4 bg-card/60 backdrop-blur-sm rounded-2xl p-6 border border-border/50">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-primary">✨ Transformación en 7 días:</span> Despierta tu claridad energética y propósito espiritual
          </p>
        </div>
      </div>
    </div>
  );
}