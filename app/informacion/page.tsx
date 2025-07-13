"use client";

import React from "react";
import { Star, Mic, FileText, Clock } from "lucide-react";

export default function InformacionPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-24 pt-16 md:pt-20 lg:pt-24 text-foreground">
      {/* Hero Section */}
      <section className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-card/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-border">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
            ¿Cómo funciona Estrella del Alba 7D?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Como suscriptora premium, desbloqueas día a día una experiencia guiada de 7 días: audio canalizado + guía práctica PDF, todo desde un mismo lugar.
          </p>
        </div>
      </section>

      {/* Funcionalidad Visual */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-muted rounded-2xl p-6 text-center shadow-lg border border-border">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500 rounded-xl">
              <Mic className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Audio Canalizado Diario</h3>
          <p className="text-muted-foreground">
            Escucha una activación vibracional guiada para abrir el canal interno y conectar con tu alma.
          </p>
        </div>

        <div className="bg-muted rounded-2xl p-6 text-center shadow-lg border border-border">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-pink-500 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">PDF de Integración</h3>
          <p className="text-muted-foreground">
            Prácticas energéticas, reflexión y guía escrita para anclar la experiencia en tu vida.
          </p>
        </div>

        <div className="bg-muted rounded-2xl p-6 text-center shadow-lg border border-border">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Avanza a tu Ritmo</h3>
          <p className="text-muted-foreground">
            El contenido se desbloquea diariamente pero queda disponible siempre. Avanza cuando lo sientas.
          </p>
        </div>
      </section>
    </main>
  );
}
