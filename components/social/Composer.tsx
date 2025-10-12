"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export function Composer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState("gratitud");

  const handlePost = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return alert("Inicia sesión para compartir 💫");
    if (!text.trim()) return;

    setLoading(true);
    await supabase.from("progress_updates").insert({
      user_id: user.id,
      content: text.trim(),
      mood,
    });
    setText("");
    setMood("gratitud");
    setLoading(false);
  };

  return (
    <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm backdrop-blur-sm space-y-4">
      <h2 className="text-lg font-semibold">Comparte tu proceso</h2>
      <Textarea
        placeholder="¿Qué integración, sensación o logro quieres compartir hoy?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />
      <div className="flex justify-between items-center">
        <select
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        >
          <option value="gratitud">🌸 Gratitud</option>
          <option value="inspiracion">✨ Inspiración</option>
          <option value="en_proceso">🌙 En proceso</option>
          <option value="necesito_apoyo">💧 Necesito apoyo</option>
        </select>

        <Button onClick={handlePost} disabled={loading || !text.trim()}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Publicando...
            </>
          ) : (
            "Compartir"
          )}
        </Button>
      </div>
    </div>
  );
}
