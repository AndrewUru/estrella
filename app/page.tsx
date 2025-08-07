import Link from "next/link";
import Image from "next/image";
import { Sparkles, Heart } from "lucide-react";
import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Beneficios } from "@/components/beneficios";
import ProcesoSection from "@/components/proceso";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-background via-background to-primary/5 text-foreground overflow-hidden">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* HERO SECTION */}
        <Hero />

        {/* PROCESO */}
        <ProcesoSection />

        <Stats />

        {/* BENEFICIOS */}
        <Beneficios />

        {/* CTA FINAL */}
        <section className="w-full max-w-4xl px-6 text-center mt-16">
          <div className="relative bg-gradient-to-br from-purple-900/20 via-primary/10 to-pink-900/20 p-12 rounded-3xl border border-primary/30 overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
            <div className="absolute top-4 right-4 text-primary/20">
              <Sparkles size={24} />
            </div>
            <div
              className="absolute bottom-4 left-4 text-primary/20"
              style={{ animationDelay: "0.5s" }}
            >
              <Heart size={20} />
            </div>

            {/* Contenido principal */}
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg">
                  <Image
                    src="/images/samari1.png"
                    alt="Samari Luz"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                  Tu alma te está llamando
                </h2>

                <div className="max-w-2xl mx-auto space-y-4">
                  <p className="text-muted-foreground text-xl leading-relaxed">
                    El camino de regreso a casa ya existe dentro de ti.
                  </p>
                  <p className="text-muted-foreground/80 text-lg">
                    Solo necesitas{" "}
                    <span className="text-primary font-semibold">
                      recordar cómo escucharla
                    </span>{" "}
                    y dar el primer paso.
                  </p>
                </div>

                {/* Urgencia sutil */}
                <div className="flex items-center justify-center gap-2 text-primary/70 text-sm">
                  <Sparkles size={16} />
                  <span>Comienza tu transformación hoy</span>
                  <Sparkles size={16} />
                </div>
              </div>

              {/* Botón mejorado */}
              <div className="mt-10">
                <Link
                  href="/upgrade"
                  className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-purple-600 text-white rounded-full text-xl font-semibold shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all duration-500 overflow-hidden"
                >
                  {/* Efecto de brillo */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                  <span className="relative z-10">
                    Comenzar mi Transformación
                  </span>
                </Link>

                {/* Texto de apoyo */}
                <p className="text-muted-foreground/60 text-sm mt-4">
                  Sin compromisos • Apoyo personalizado
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
