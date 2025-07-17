//C:\estrella\app\protected\admin\contenido\page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface Entrega {
  id: number;
  dia: number;
  titulo: string;
  descripcion: string;
  archivo_pdf: string;
  audio_url: string;
  imagen_url: string;
  fecha_disponible: string;
}

export default function ContenidoPage() {
  const router = useRouter();
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    async function cargarContenido() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login?returnTo=/protected/admin/contenido");
        return;
      }

      const { data: perfil } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (perfil?.role !== "admin") {
        router.push("/no-access");
        return;
      }

      const { data, error } = await supabase
        .from("entregas")
        .select("*")
        .order("dia", { ascending: true });

      if (!error && data) {
        setEntregas(data as Entrega[]);
      }

      setLoading(false);
    }

    cargarContenido();
  }, [router]);

  const actualizarCampo = (
    index: number,
    campo: keyof Entrega,
    valor: string
  ) => {
    setEntregas((prev) =>
      prev.map((dia, i) => (i === index ? { ...dia, [campo]: valor } : dia))
    );
  };

  const guardarCambios = async () => {
    const { error } = await supabase.from("entregas").upsert(entregas);

    if (!error) {
      setMensaje("✅ Contenido actualizado");
      setTimeout(() => setMensaje(null), 3000);
    } else {
      setMensaje("⚠️ Error al guardar cambios");
    }
  };

  if (loading) return <p className="p-6">Cargando contenido…</p>;

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-pink-800">
        🌀 Contenido Ceremonial
      </h1>

      {mensaje && <div className="text-sm text-pink-600">{mensaje}</div>}

      {entregas.map((dia, i) => (
        <div
          key={dia.id}
          className="bg-white border rounded-xl p-4 shadow space-y-4"
        >
          <h2 className="text-lg font-semibold text-pink-700">Día {dia.dia}</h2>

          <Input
            value={dia.titulo}
            onChange={(e) => actualizarCampo(i, "titulo", e.target.value)}
            placeholder="Título"
          />
          <Textarea
            value={dia.descripcion}
            onChange={(e) => actualizarCampo(i, "descripcion", e.target.value)}
            placeholder="Descripción del día"
          />
          <Input
            value={dia.audio_url}
            onChange={(e) => actualizarCampo(i, "audio_url", e.target.value)}
            placeholder="URL del audio"
          />
          <Input
            value={dia.archivo_pdf}
            onChange={(e) => actualizarCampo(i, "archivo_pdf", e.target.value)}
            placeholder="PDF descargable"
          />
          <Input
            value={dia.imagen_url}
            onChange={(e) => actualizarCampo(i, "imagen_url", e.target.value)}
            placeholder="URL de imagen (opcional)"
          />
          <Input
            type="date"
            value={dia.fecha_disponible?.slice(0, 10)}
            onChange={(e) =>
              actualizarCampo(i, "fecha_disponible", e.target.value)
            }
            placeholder="Fecha disponible"
          />
        </div>
      ))}

      <Button onClick={guardarCambios} className="mt-6">
        💾 Guardar todo
      </Button>
    </main>
  );
}
