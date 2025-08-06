"use client";

import React from "react";
import { Star, Mic, FileText, Clock } from "lucide-react";
import Link from "next/link";

export default function InformacionPage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-24 pt-16 md:pt-20 lg:pt-24 text-foreground">
      {/* Hero Section */}
      <section className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/70 dark:bg-gray-900/60 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-200/40 dark:border-purple-700/30">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-2xl font-black bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 dark:from-purple-300 dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent mb-6">
            ¿Cómo funciona Estrella del Alba 7D?
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-4">
            Como suscriptora premium, desbloqueas día a día una experiencia
            guiada de 7 días: audio canalizado + guía práctica PDF, todo desde
            un mismo lugar.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Esta suscripción, de precio accesible, nos permite sostener y cuidar
            esta plataforma independiente creada con dedicación, esfuerzo y
            mucho amor para acompañarte en tu proceso de reconexión.
          </p>
        </div>
      </section>

      <div className="flex justify-center">
        <Link
          href="/upgrade"
          className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-sm font-semibold px-6 py-2 rounded-xl shadow-md transition-all duration-300"
        >
          💎 Acceder como Premium
        </Link>
      </div>

      {/* Funcionalidad Visual */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="bg-purple-100/40 dark:bg-purple-900/20 rounded-2xl p-6 text-center shadow-lg border border-purple-200/30 dark:border-purple-700/30">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500 rounded-xl">
              <Mic className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-2">
            Audio Canalizado Diario
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Escucha una activación vibracional guiada para abrir el canal
            interno y conectar con tu alma.
          </p>
        </div>

        <div className="bg-pink-100/40 dark:bg-pink-900/20 rounded-2xl p-6 text-center shadow-lg border border-pink-200/30 dark:border-pink-700/30">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-pink-500 rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-pink-800 dark:text-pink-200 mb-2">
            PDF de Integración
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Prácticas energéticas, reflexión y guía escrita para anclar la
            experiencia en tu vida.
          </p>
        </div>

        <div className="bg-blue-100/40 dark:bg-blue-900/20 rounded-2xl p-6 text-center shadow-lg border border-blue-200/30 dark:border-blue-700/30">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Avanza a tu Ritmo
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            El contenido se desbloquea diariamente pero queda disponible
            siempre. Avanza cuando lo sientas.
          </p>
        </div>
      </section>
    </main>
  );
}
