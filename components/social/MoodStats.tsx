"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { useFeed } from "./hooks/useFeed";
import { motion } from "framer-motion";

const moodOptions = [
  { value: "gratitud", label: "Gratitud", emoji: "🌸" },
  { value: "inspiracion", label: "Inspiración", emoji: "✨" },
  { value: "en_proceso", label: "En proceso", emoji: "🌙" },
  { value: "necesito_apoyo", label: "Necesito apoyo", emoji: "💧" },
];

export function MoodStats() {
  const { feed } = useFeed();

  const stats = moodOptions.map((mood) => ({
    ...mood,
    count: feed.filter((p) => p.mood === mood.value).length,
  }));

  const total = feed.length;
  const topMood = stats.sort((a, b) => b.count - a.count)[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-border/70 bg-card/90 shadow-sm backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Energía del grupo
          </CardTitle>
          <CardDescription>
            Estado vibracional actual compartido por la comunidad 🌞
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {stats.map((s) => (
            <div
              key={s.value}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-2"
            >
              <span className="text-sm font-medium">
                {s.emoji} {s.label}
              </span>
              <span className="text-xs text-muted-foreground">{s.count}</span>
            </div>
          ))}

          <div className="pt-3 border-t border-border/40">
            <p className="text-xs text-muted-foreground">
              Total de publicaciones: <strong>{total}</strong> · Estado
              predominante:{" "}
              <strong>
                {topMood?.emoji} {topMood?.label ?? "Sin datos"}
              </strong>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
