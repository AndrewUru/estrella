"use client";

import React, { useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  Music,
  Upload,
  ImageIcon,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Crown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Tipos estrictos
type PracticeKind = "meditation" | "channeling";
type Visibility = "public" | "private" | "unlisted";
type Plan = "free" | "premium";

type FormState = {
  title: string;
  kind: PracticeKind;
  description: string;
  language: string;
  facilitator: string;
  duration: string; // minutos como string para input controlado
  tags: string; // CSV
  visibility: Visibility;
  recordedAt: string; // YYYY-MM-DD
  plan: Plan; // NUEVO: plan elegido por admin
  audioFile: File | null;
  coverFile: File | null;
  pdfFile: File | null;
};

function cn(...xs: Array<string | false | null | undefined>): string {
  return xs.filter(Boolean).join(" ");
}

export default function NewPracticeForm({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [state, setState] = useState<FormState>({
    title: "",
    kind: "meditation",
    description: "",
    language: "es",
    facilitator: "",
    duration: "",
    tags: "",
    visibility: "private",
    recordedAt: "",
    plan: "free", // por defecto Gratis
    audioFile: null,
    coverFile: null,
    pdfFile: null,
  });
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const canSubmit = useMemo(
    () => state.title.trim().length > 2 && !!state.kind && !submitting,
    [state.title, state.kind, submitting]
  );

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function uploadToBucket(
    bucket: "media-audio" | "media-covers" | "media-pdfs",
    file: File
  ): Promise<string> {
    const ext = file.name.includes(".") ? file.name.split(".").pop()! : "bin";
    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${ext}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) throw error;
    const pub = supabase.storage.from(bucket).getPublicUrl(data.path);
    return pub.data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      if (!user) throw new Error("Debes iniciar sesión para crear contenido.");

      let audio_url: string | null = null;
      let cover_url: string | null = null;
      let pdf_url: string | null = null;

      if (state.audioFile) {
        audio_url = await uploadToBucket("media-audio", state.audioFile);
      }
      if (state.coverFile) {
        cover_url = await uploadToBucket("media-covers", state.coverFile);
      }
      if (state.pdfFile) {
        pdf_url = await uploadToBucket("media-pdfs", state.pdfFile);
      }

      const tagsArray = state.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const duration_minutes = state.duration
        ? parseInt(state.duration, 10)
        : null;
      const recorded_at = state.recordedAt
        ? new Date(state.recordedAt).toISOString()
        : null;

      const { error: insertErr } = await supabase.from("practices").insert({
        title: state.title.trim(),
        kind: state.kind,
        description: state.description.trim() || null,
        language: state.language || "es",
        facilitator: state.facilitator.trim() || null,
        duration_minutes,
        tags: tagsArray,
        audio_url,
        cover_url,
        pdf_url, // AÑADIDO
        recorded_at,
        visibility: state.visibility,
        plan: state.plan, // AÑADIDO: persistir plan
        created_by: (await supabase.auth.getUser()).data.user?.id ?? null,
      });

      if (insertErr) throw insertErr;

      setMessage({ type: "success", text: "¡Práctica creada con éxito!" });
      // reset parcial
      setState((s) => ({
        ...s,
        title: "",
        description: "",
        facilitator: "",
        duration: "",
        tags: "",
        recordedAt: "",
        plan: s.plan, // conservar última elección de plan para siguientes cargas
        audioFile: null,
        coverFile: null,
        pdfFile: null, // AÑADIDO
      }));
      onCreated?.();
    } catch (err: unknown) {
      console.error(err);
      const msg =
        err instanceof Error ? err.message : "Error al crear la práctica.";
      setMessage({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <header className="flex items-center gap-3">
        <div className="p-2 rounded-2xl bg-indigo-100 text-indigo-600">
          <Music className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            Nueva meditación / canalización
          </h2>
          <p className="text-sm text-muted-foreground">
            Sube el audio, añade detalles y publica cuando estés lista.
          </p>
        </div>
      </header>

      {message && (
        <div
          className={cn(
            "rounded-2xl p-3 flex items-start gap-2",
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          )}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 mt-0.5" />
          )}
          <span className="text-sm">{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Título *</label>
          <Input
            placeholder="Ej. Viaje al corazón"
            value={state.title}
            onChange={(e) => onChange("title", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" /> Material en PDF (opcional)
          </label>
          <div className="border border-dashed border-border rounded-2xl p-4 flex items-center justify-between">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => onChange("pdfFile", e.target.files?.[0] ?? null)}
            />
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Upload className="w-4 h-4" />
              Subir
            </span>
          </div>
          {state.pdfFile && (
            <p className="text-xs text-muted-foreground">
              Seleccionado: {state.pdfFile.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo *</label>
          <select
            className="w-full rounded-2xl border border-border p-3 bg-background"
            value={state.kind}
            onChange={(e) => onChange("kind", e.target.value as PracticeKind)}
          >
            <option value="meditation">Meditación</option>
            <option value="channeling">Canalización</option>
          </select>
        </div>

        {/* NUEVO: Selector de plan */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Crown className="w-4 h-4" /> Plan de acceso
          </label>
          <div className="flex items-center gap-2">
            <select
              className="w-full rounded-2xl border border-border p-3 bg-background"
              value={state.plan}
              onChange={(e) => onChange("plan", e.target.value as Plan)}
            >
              <option value="free">Gratis</option>
              <option value="premium">Premium</option>
            </select>
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-xl border text-xs",
                state.plan === "premium"
                  ? "border-amber-300 text-amber-700 bg-amber-50"
                  : "border-emerald-300 text-emerald-700 bg-emerald-50"
              )}
            >
              {state.plan === "premium" ? (
                <>
                  <Crown className="w-3 h-3" /> Premium
                </>
              ) : (
                <>Gratis</>
              )}
            </span>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium">Descripción</label>
          <Textarea
            placeholder="Intención, beneficios, guía de uso..."
            value={state.description}
            onChange={(e) => onChange("description", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Idioma</label>
          <Input
            placeholder="es, en, pt..."
            value={state.language}
            onChange={(e) => onChange("language", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Facilitadora/or</label>
          <Input
            placeholder="Nombre del facilitador"
            value={state.facilitator}
            onChange={(e) => onChange("facilitator", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duración (min)</label>
          <Input
            type="number"
            min={0}
            placeholder="Ej. 25"
            value={state.duration}
            onChange={(e) => onChange("duration", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha de grabación</label>
          <Input
            type="date"
            value={state.recordedAt}
            onChange={(e) => onChange("recordedAt", e.target.value)}
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium">
            Tags (separados por comas)
          </label>
          <Input
            placeholder="relajación, corazón, sanación"
            value={state.tags}
            onChange={(e) => onChange("tags", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Music className="w-4 h-4" /> Audio (mp3/wav/m4a)
          </label>
          <div className="border border-dashed border-border rounded-2xl p-4 flex items-center justify-between">
            <input
              type="file"
              accept="audio/*"
              onChange={(e) =>
                onChange("audioFile", e.target.files?.[0] ?? null)
              }
            />
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Upload className="w-4 h-4" />
              Subir
            </span>
          </div>
          {state.audioFile && (
            <p className="text-xs text-muted-foreground">
              Seleccionado: {state.audioFile.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Portada (jpg/png)
          </label>
          <div className="border border-dashed border-border rounded-2xl p-4 flex items-center justify-between">
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                onChange("coverFile", e.target.files?.[0] ?? null)
              }
            />
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Upload className="w-4 h-4" />
              Subir
            </span>
          </div>
          {state.coverFile && (
            <p className="text-xs text-muted-foreground">
              Seleccionado: {state.coverFile.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "inline-flex items-center gap-2 rounded-2xl",
            canSubmit
              ? "bg-indigo-600 text-white"
              : "bg-neutral-200 text-neutral-500"
          )}
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {submitting ? "Guardando..." : "Guardar práctica"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            setState({
              title: "",
              kind: "meditation",
              description: "",
              language: "es",
              facilitator: "",
              duration: "",
              tags: "",
              visibility: "private",
              recordedAt: "",
              plan: "free", // reset a Gratis
              audioFile: null,
              coverFile: null,
              pdfFile: null, // AÑADIDO
            })
          }
        >
          Limpiar
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Consejo: deja la visibilidad en <b>private</b> mientras revisas y luego
        cámbiala a <b>public</b>.
      </p>
    </form>
  );
}
