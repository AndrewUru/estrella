import Link from "next/link";
import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-background via-background to-primary/5 text-foreground overflow-hidden">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* HERO SECTION */}
        <Hero />

        <Stats />

        {/* BENEFICIOS */}
        <section className="w-full max-w-6xl px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
          <div className="bg-card/30 p-8 rounded-3xl border border-border/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <h2 className="text-2xl font-semibold">¿Te reconoces en esto?</h2>
            </div>
            <div className="space-y-4">
              {[
                "Desconexión del propósito interior",
                "Confusión tras años de camino espiritual",
                "Alta sensibilidad sin herramientas claras",
                "Deseo de claridad energética y dirección",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-destructive/5 rounded-xl"
                >
                  <div className="w-2 h-2 bg-destructive rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card/30 p-8 rounded-3xl border border-border/50 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-semibold">
                Tu transformación en 7 días
              </h2>
            </div>
            <div className="space-y-4">
              {[
                "Claridad energética restaurada",
                "Canal intuitivo activo",
                "Dirección interior activada",
                "Pacto sagrado con tu alma",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 bg-primary/5 rounded-xl"
                >
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section className="w-full max-w-5xl px-6 mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              El Proceso de Reconexión
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cada día es una puerta hacia tu esencia más profunda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                day: "1-2",
                title: "Limpieza Energética",
                desc: "Liberación de bloqueos",
              },
              {
                day: "3-5",
                title: "Activación",
                desc: "Despertar del canal intuitivo",
              },
              {
                day: "6-7",
                title: "Integración",
                desc: "Pacto sagrado con tu alma",
              },
            ].map((phase, index) => (
              <div key={index} className="relative">
                <div className="bg-card/50 p-6 rounded-2xl border border-border/50 backdrop-blur-sm text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-background font-bold text-lg mx-auto mb-4">
                    {phase.day}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{phase.title}</h3>
                  <p className="text-muted-foreground">{phase.desc}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary/30"></div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="w-full max-w-4xl px-6 text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-3xl border border-primary/20">
            <h2 className="text-3xl font-bold mb-4">
              ¿Lista para regresar a casa?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Tu alma ya conoce el camino. Solo necesitas recordar cómo
              escucharla.
            </p>
            <Link
              href="/protected"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-background rounded-full text-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Comenzar mi Transformación
              <span>✨</span>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
