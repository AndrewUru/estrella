"use client";

import { useFeed } from "./hooks/useFeed";
import { PostCard } from "./PostCard";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

export function Feed() {
  const { feed, isLoading, refetch, isFetching, isError, error } = useFeed();
  const hasPosts = feed.length > 0;
  const errorMessage =
    error instanceof Error ? error.message : "Intenta nuevamente en unos segundos.";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Conversaciones recientes</h2>
          <p className="text-sm text-muted-foreground">
            Explora como avanza la comunidad y comparte tu propio progreso.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 self-start sm:self-auto"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Actualizando...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span>Refrescar</span>
            </>
          )}
        </Button>
      </header>

      {isLoading ? (
        <div className="space-y-4" role="status" aria-live="polite">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="border-border/60 bg-card/80">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 animate-pulse rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-24 animate-pulse rounded bg-muted/80" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full animate-pulse rounded bg-muted" />
                  <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-muted/80" />
                </div>
                <div className="flex gap-3">
                  <div className="h-8 w-20 animate-pulse rounded-lg bg-muted/70" />
                  <div className="h-8 w-20 animate-pulse rounded-lg bg-muted/70" />
                </div>
              </CardContent>
            </Card>
          ))}
          <span className="sr-only">Cargando publicaciones...</span>
        </div>
      ) : isError ? (
        <Card className="border-destructive/40 bg-destructive/5 text-destructive">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-sm font-semibold">No pudimos actualizar el feed.</h3>
              <p className="text-sm opacity-80">{errorMessage}</p>
            </div>
            <Button variant="outline" className="gap-2" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      ) : !hasPosts ? (
        <Card className="border-dashed border-border/60 bg-card/80 text-center">
          <CardContent className="space-y-3 p-8">
            <p className="text-base font-medium">Aun no hay publicaciones.</p>
            <p className="text-sm text-muted-foreground">
              Comparte una actualizacion para iniciar la conversacion.
            </p>
            <Button variant="secondary" className="gap-2" onClick={() => refetch()}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Buscar nuevas historias
            </Button>
          </CardContent>
        </Card>
      ) : (
        <AnimatePresence mode="popLayout">
          {feed.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
