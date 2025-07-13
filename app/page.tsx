import Link from "next/link";
import { Hero } from "@/components/hero";
import { Stats } from "@/components/stats";
import { Beneficios } from "@/components/beneficios";
import  ProcesoSection  from "@/components/proceso";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-br from-background via-background to-primary/5 text-foreground overflow-hidden">
      <div className="flex-1 w-full flex flex-col items-center">
        {/* HERO SECTION */}
        <Hero />

        <Stats />

        {/* BENEFICIOS */}
        <Beneficios />

        {/* PROCESO */}
        <ProcesoSection />

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
