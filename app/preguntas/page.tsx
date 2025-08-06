"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "⏳ ¿Cuánto tiempo debo dedicar cada día?",
    answer:
      "Solo necesitas entre 25 y 35 minutos diarios: 10-15 min de clase + 15-20 min de práctica energética.",
  },
  {
    question: "✨ ¿Debo haber hecho YADI® antes?",
    answer:
      "¡No! Este programa es para tod@s, con o sin experiencia previa. Si ya conoces YADI®, te ayudará a profundizar. Si es tu primera vez, será una introducción poderosa.",
  },
  {
    question: "🔮 ¿Qué hace único a este programa?",
    answer:
      "Se basa en dos pilares: el Protocolo YADI® (códigos vibracionales canalizados) y el Kit Esencial YADI® (herramientas energéticas seguras). Aquí hay estructura, contención y método real.",
  },
  {
    question: "📲 ¿Cómo accedo al contenido?",
    answer:
      "Cada día subimos la clase a la plataforma y te notificamos por WhatsApp en un grupo silencioso.",
  },
  {
    question: "🧘‍♀️ ¿Hay sesiones en vivo?",
    answer:
      "De momento no hay sesiones en vivo previstas. Todo el contenido estará disponible para que lo sigas a tu ritmo durante los 7 días.",
  },
  {
    question: "🙏 ¿Y si no puedo hacerlo cada día?",
    answer:
      "Tendrás acceso ilimitado al contenido para avanzar a tu ritmo, sin presiones.",
  },
  {
    question: "🔐 ¿El acceso caduca?",
    answer:
      "Depende del plan. Si eliges una suscripción mensual o anual, el acceso estará disponible mientras tu suscripción esté activa. En el caso de acceso gratuito, podrás acceder mientras la plataforma esté en funcionamiento.",
  },
  {
    question: "💸 ¿Es un pago único o suscripción?",
    answer:
      "Es una suscripción. Puedes elegir entre un plan mensual de 22 € o un plan anual de 77 €. Puedes cancelar en cualquier momento desde tu perfil.",
  },
];

export default function PreguntasPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <main className="max-w-3xl mx-auto py-12 px-6 pt-16 md:pt-20 lg:pt-24">
      <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-purple-700 via-violet-500 to-pink-500 dark:from-purple-300 dark:via-violet-200 dark:to-pink-300 bg-clip-text text-transparent">
        Preguntas Frecuentes
      </h1>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-purple-100/40 dark:bg-purple-900/20 shadow-md rounded-2xl border border-purple-200/30 dark:border-purple-700/30 overflow-hidden"
          >
            <button
              onClick={() => toggleIndex(idx)}
              className="w-full text-left px-6 py-4 font-semibold text-purple-800 dark:text-purple-300 flex justify-between items-center"
            >
              {faq.question}
              <motion.span
                initial={{ rotate: 0 }}
                animate={{ rotate: activeIndex === idx ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ▼
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {activeIndex === idx && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-6 text-gray-700 dark:text-gray-300"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-2xl shadow-lg">
          ¿Tienes otra duda? Escríbenos a: {" "}
          <a
            href="mailto:Marketing@samariluz.com"
            className="underline font-semibold"
          >
            Marketing@samariluz.com
          </a>
        </div>
      </div>
    </main>
  );
}