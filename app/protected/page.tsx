"use client";
import { useProgreso } from "@/lib/hooks/useProgreso";

export default function PaginaProtegida() {
  const { progreso, userId } = useProgreso();

  return (
    <div>
      <h1>Tu progreso</h1>
      <ul>
        {progreso.map((p) => (
          <li key={p.dia}>
            Día {p.dia}: {p.completado ? "✅ Completado" : "❌ Incompleto"}
            {!p.completado && p.desbloqueado && (
              <button
                onClick={async () => {
                  await fetch("/api/progreso/completar", {
                    method: "POST",
                    body: JSON.stringify({ user_id: userId, dia: p.dia }),
                  });
                  window.location.reload();
                }}
              >
                Marcar como completado
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
