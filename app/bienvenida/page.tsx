// app/bienvenida/page.tsx
export default function BienvenidaPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 text-white p-8 text-center">
      <h1 className="text-3xl font-bold mb-4">
        ✨Bienvenid@ a Estrella del Alba✨
      </h1>
      <p className="text-lg mb-6 max-w-xl">
        Tu camino de reconexión contigo comienza aquí. Disfruta de los
        contenidos y experiencias diseñados para activar tu luz interior.
      </p>
      <a
        href="/protected"
        className="px-6 py-3 bg-white text-violet-800 font-semibold rounded-xl shadow-lg hover:bg-gray-100 transition"
      >
        Ir a Mi Espacio
      </a>
    </div>
  );
}
