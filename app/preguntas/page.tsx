import React from "react";

const faqs = [
  {
    question: "⏳ ¿Cuánto tiempo debo dedicar cada día?",
    answer:
      "Solo necesitas entre 25 y 35 minutos diarios: 10-15 min de clase + 15-20 min de práctica energética.",
  },
  {
    question: "✨ ¿Debo haber hecho YADI® antes?",
    answer:
      "¡No! Este programa es para todas, con o sin experiencia previa. Si ya conoces YADI®, te ayudará a profundizar. Si es tu primera vez, será una introducción poderosa.",
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
  return (
    <main className="max-w-3xl mx-auto py-12 px-6 pt-16 md:pt-20 lg:pt-24">
      <h1 className="text-4xl font-bold mb-10 text-center text-purple-700 dark:text-purple-300">
        Preguntas Frecuentes
      </h1>
      <div className="space-y-8">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
          >
            <h2 className="text-xl font-semibold text-purple-800 dark:text-purple-300 mb-2">
              {faq.question}
            </h2>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
