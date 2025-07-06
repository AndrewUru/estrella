"use client";

import React from "react";

export default function InformacionPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-16 pt-16 md:pt-20 lg:pt-24">
      <section className="text-center">
        <h1 className="text-4xl font-extrabold text-primary mb-4">
          Toda la Información que Necesitas
        </h1>
        <p className="text-muted-foreground text-lg">
          Descubre qué incluye Estrella del Alba 7D y cómo puede transformar tu
          conexión interna.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          ¿Cuánto tiempo necesito dedicar cada día?
        </h2>
        <p className="text-muted-foreground">
          Entre 25 y 35 minutos diarios: 10-15 minutos de clase + 15-20 minutos
          de práctica.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          ¿Es solo para personas que no han hecho YADI® antes?
        </h2>
        <p className="text-muted-foreground">
          ¡Para nada! Este curso es para todos. Si ya tienes experiencia con
          YADI®, reforzarás lo aprendido y profundizarás en tu conexión. Cada
          persona recibe lo que necesita.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          ¿En qué se basa este programa?
        </h2>
        <ul className="list-disc list-inside text-muted-foreground space-y-2">
          <li>
            El protocolo YADI®: limpieza, alineación y activación con códigos
            vibracionales canalizados.
          </li>
          <li>
            Uso del Kit Esencial: herramientas para abrir y armonizar tu canal
            con seguridad energética.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          ¿Cómo accedo al contenido cada día?
        </h2>
        <p className="text-muted-foreground">
          El contenido se liberará diariamente en nuestra plataforma.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">¿Habrá sesiones en directo?</h2>
        <p className="text-muted-foreground">
          Sí, el Día 7 habrá una sesión en vivo con Samarí para integrar el
          proceso y cerrar el viaje ceremonial.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">
          ¿Qué pasa si me pierdo un día?
        </h2>
        <p className="text-muted-foreground">
          El acceso es ilimitado. Puedes avanzar a tu ritmo y retomar los días
          que necesites.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">¿El contenido caduca?</h2>
        <p className="text-muted-foreground">
          No. Una vez te inscribes, tendrás acceso de por vida mientras la
          plataforma esté activa.
        </p>
      </section>

      <section className="bg-card rounded-2xl shadow p-6 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Precio del Curso
        </h2>
        <p className="text-muted-foreground mb-4">
          Accede a los 7 días de transformación + contenido extra.
        </p>
        <p className="text-4xl font-extrabold text-primary">22 €</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Si luego te unes al Kit Esencial YADI®, este curso será gratuito para
          ti.
          <br />
          Te damos un bono de 22 € al formalizar la reserva del kit.
        </p>
      </section>
    </main>
  );
}
