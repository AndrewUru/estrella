import React from "react";

const faqs = [
  {
    question: "\u23F3 \u00bfCu\u00e1nto tiempo debo dedicar cada d\u00eda?",
    answer:
      "Solo necesitas entre 25 y 35 minutos diarios: 10-15 min de clase + 15-20 min de pr\u00e1ctica energ\u00e9tica.",
  },
  {
    question: "\u2728 \u00bfDebo haber hecho YADI\u00ae antes?",
    answer:
      "\u00a1No! Este programa es para todos, sin importar tu experiencia previa. Si ya conoces YADI\u00ae, te ayudar\u00e1 a profundizar. Si es tu primera vez, ser\u00e1 una poderosa introducci\u00f3n.",
  },
  {
    question: "\ud83d\udd2e \u00bfQu\u00e9 hace \u00fanico a este programa?",
    answer:
      "Se basa en dos pilares: Protocolo YADI\u00ae (c\u00f3digos vibracionales canalizados) y el Kit Esencial YADI\u00ae (herramientas energ\u00e9ticas seguras). Aqu\u00ed hay estructura, contenci\u00f3n y m\u00e9todo real.",
  },
  {
    question: "\ud83d\udcf2 \u00bfC\u00f3mo accedo al contenido?",
    answer:
      "Cada d\u00eda subimos la clase a la plataforma y te avisamos por WhatsApp en un grupo silencioso.",
  },
  {
    question: "\ud83e\uddd8\u200d\u2640\ufe0f \u00bfHay sesiones en vivo?",
    answer:
      "S\u00ed. El D\u00eda 7 tendremos un ritual de cierre en directo con Samar\u00ed para integrar y sellar el proceso.",
  },
  {
    question: "\ud83d\ude4f \u00bfY si no puedo hacerlo cada d\u00eda?",
    answer:
      "Tendr\u00e1s acceso ilimitado al contenido para avanzar a tu ritmo, sin presiones.",
  },
  {
    question: "\ud83d\udd10 \u00bfEl acceso caduca?",
    answer:
      "No. Una vez inscrita, tienes acceso de por vida mientras la plataforma est\u00e9 activa.",
  },
];

export default function PreguntasPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-purple-700">
        Preguntas Frecuentes
      </h1>
      <div className="space-y-8">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">
              {faq.question}
            </h2>
            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
