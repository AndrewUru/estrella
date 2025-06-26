"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function DiaPage() {
  const { dia } = useParams();
  const router = useRouter();

  const [accesoPermitido, setAccesoPermitido] = useState(false);
  interface Entrega {
    dia: number;
    titulo: string;
    descripcion: string;
    archivo_pdf: string;
    audio_url: string;
  }

  const [entrega, setEntrega] = useState<Entrega | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEntrega = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/auth/login");

      const { data: perfil } = await supabase
        .from("profiles")
        .select("start_date")
        .eq("id", user.id)
        .single();

      if (!perfil?.start_date) return;

      const diasDesdeInicio = Math.floor(
        (new Date().getTime() - new Date(perfil.start_date).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const diaActual = parseInt(dia as string);
      const acceso = diaActual <= diasDesdeInicio + 1;
      setAccesoPermitido(acceso);

      if (!acceso) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("entregas")
        .select("*")
        .eq("dia", diaActual)
        .single();

      setEntrega(data);
      setLoading(false);
    };

    cargarEntrega();
  }, [dia, router]);

  if (loading)
    return <p className="text-center mt-10">Cargando contenido...</p>;

  if (!accesoPermitido) {
    return (
      <div className="text-center mt-10 px-4">
        <h2 className="text-xl font-semibold mb-2">
          Este contenido no está disponible aún.
        </h2>
        <p className="text-gray-600">
          Vuelve en unos días o revisa tu avance en el dashboard.
        </p>
      </div>
    );
  }

  if (!entrega) {
    return (
      <div className="text-center mt-10 px-4">
        <h2 className="text-xl font-semibold mb-2">Contenido no encontrado.</h2>
        <p className="text-gray-600">
          No se ha cargado material para el día {dia}.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">
        Día {entrega.dia}: {entrega.titulo}
      </h1>
      <p className="mb-4 text-gray-700">{entrega.descripcion}</p>

      {entrega.archivo_pdf && (
        <a
          href={entrega.archivo_pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-blue-600 underline mb-6"
        >
          Ver PDF
        </a>
      )}

      {entrega.audio_url && (
        <audio controls className="w-full mt-4">
          <source src={entrega.audio_url} type="audio/mpeg" />
          Tu navegador no soporta el audio.
        </audio>
      )}
    </div>
  );
}
