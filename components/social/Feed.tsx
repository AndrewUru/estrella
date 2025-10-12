"use client";

import { useFeed } from "./hooks/useFeed";
import { PostCard } from "./PostCard";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Feed() {
  const { feed, isLoading, refetch, isFetching } = useFeed();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Conversaciones recientes</h2>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Actualizando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" /> Refrescar
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">
          Cargando publicaciones...
        </p>
      ) : feed.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border/60 bg-card/70 p-8 text-center text-sm text-muted-foreground">
          Aún no hay publicaciones. 🌱 Sé la primera en compartir tu proceso.
        </div>
      ) : (
        feed.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <PostCard post={post} />
          </motion.div>
        ))
      )}
    </div>
  );
}
