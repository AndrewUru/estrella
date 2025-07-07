"use client";

import React, { useState } from "react";
import {
  Clock,
  Users,
  BookOpen,
  Calendar,
  Play,
  Infinity,
  Star,
  Sparkles,
  Heart,
  Shield,
} from "lucide-react";

export default function InformacionPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "¿Cuánto tiempo necesito dedicar cada día?",
      answer:
        "Entre 25 y 35 minutos diarios: 10-15 minutos de clase + 15-20 minutos de práctica.",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      id: 2,
      question: "¿Es solo para personas que no han hecho YADI® antes?",
      answer:
        "¡Para nada! Este curso es para todos. Si ya tienes experiencia con YADI®, reforzarás lo aprendido y profundizarás en tu conexión. Cada persona recibe lo que necesita.",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 3,
      question: "¿En qué se basa este programa?",
      answer:
        "El protocolo YADI®: limpieza, alineación y activación con códigos vibracionales canalizados. Uso del Kit Esencial: herramientas para abrir y armonizar tu canal con seguridad energética.",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 4,
      question: "¿Cómo accedo al contenido cada día?",
      answer: "El contenido se liberará diariamente en nuestra plataforma.",
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 5,
      question: "¿Habrá sesiones en directo?",
      answer:
        "Sí, el Día 7 habrá una sesión en vivo con Samarí para integrar el proceso y cerrar el viaje ceremonial.",
      icon: <Play className="w-5 h-5" />,
    },
    {
      id: 6,
      question: "¿Qué pasa si me pierdo un día?",
      answer:
        "El acceso es ilimitado. Puedes avanzar a tu ritmo y retomar los días que necesites.",
      icon: <Infinity className="w-5 h-5" />,
    },
    {
      id: 7,
      question: "¿El contenido caduca?",
      answer:
        "No. Una vez te inscribes, tendrás acceso de por vida mientras la plataforma esté activa.",
      icon: <Shield className="w-5 h-5" />,
    },
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-12 space-y-20 pt-16 md:pt-20 lg:pt-24">
      {/* Hero Section */}
      <section className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
              <Star className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Toda la Información que Necesitas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubre qué incluye{" "}
            <span className="font-semibold text-purple-600">
              Estrella del Alba 7D
            </span>{" "}
            y cómo puede transformar tu conexión interna de manera profunda y
            auténtica.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="group hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 h-full shadow-lg hover:shadow-xl border border-purple-200">
            <div className="p-3 bg-purple-500 rounded-xl w-fit mb-4 group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-purple-900 mb-3">
              7 Días de Transformación
            </h3>
            <p className="text-purple-700">
              Un viaje estructurado de autodescubrimiento y conexión profunda
              contigo mismo.
            </p>
          </div>
        </div>

        <div className="group hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 h-full shadow-lg hover:shadow-xl border border-blue-200">
            <div className="p-3 bg-blue-500 rounded-xl w-fit mb-4 group-hover:rotate-12 transition-transform duration-300">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-900 mb-3">
              Protocolo YADI®
            </h3>
            <p className="text-blue-700">
              Técnicas probadas de limpieza, alineación y activación con códigos
              vibracionales.
            </p>
          </div>
        </div>

        <div className="group hover:scale-105 transition-all duration-300">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 h-full shadow-lg hover:shadow-xl border border-pink-200">
            <div className="p-3 bg-pink-500 rounded-xl w-fit mb-4 group-hover:rotate-12 transition-transform duration-300">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-pink-900 mb-3">
              Acceso mensual
            </h3>
            <p className="text-pink-700">
              Una vez inscrito, tendrás acceso ilimitado a todo el contenido y
              actualizaciones.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600">
            Resuelve todas tus dudas sobre el programa
          </p>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                    {faq.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <div
                  className={`transform transition-transform duration-200 ${
                    expandedFaq === faq.id ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedFaq === faq.id
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="pl-14">
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 rounded-3xl blur-3xl"></div>
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"></div>

          <div className="p-8 md:p-12 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <Star className="w-10 h-10 text-white" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Precio del Curso
            </h2>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Accede a los 7 días de transformación + contenido extra y sesión
              en vivo
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8 border border-purple-200">
              <p className="text-lg text-slate-700 font-semibold">
                Todo esto por solo{" "}
                <span className="text-purple-600">22 €/mes</span>. 💡 Una
                suscripción accesible frente a otros cursos de cientos o miles
                de euros. Aquí tu alma se reconecta sin que tu bolsillo sufra.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center justify-center mb-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Heart className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-green-800 font-semibold mb-2">
                🎁 Bonus Especial
              </p>
              <p className="text-green-700 text-sm leading-relaxed">
                Si luego te unes al Kit Esencial YADI®, este curso será{" "}
                <span className="font-bold">completamente gratuito</span> para
                ti.
                <br />
                Te damos un bono de 22 € al formalizar la reserva del kit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
          <h3 className="text-3xl font-bold mb-4">
            ¿Listo para comenzar tu transformación?
          </h3>
          <p className="text-xl opacity-90 mb-6">
            Únete a cientos de personas que ya han vivido esta experiencia
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Comenzar Ahora
          </button>
        </div>
      </section>
    </main>
  );
}
