import Image from "next/image";

export default function NoAccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-6">
      <Image
        src="/logo-estrella.png"
        alt="Estrella del Alba"
        width={96}
        height={96}
        className="w-24 h-24 mb-6"
        priority
      />
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Acceso restringido
      </h1>
      <p className="text-gray-700 mb-6 max-w-md">
        Tu cuenta aún no está activada. Esto puede deberse a que aún no se ha
        procesado tu suscripción o a que necesitas autorización manual.
      </p>
      <a
        href="https://wa.me/34123456789"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
      >
        Contactar soporte por WhatsApp
      </a>
    </main>
  );
}
