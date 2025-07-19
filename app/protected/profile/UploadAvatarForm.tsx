"use client";

import { useRef, useState } from "react";

export function UploadAvatarForm() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setMessage("Selecciona un archivo");
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setMessage("Formato no permitido. Usa PNG, JPG o WebP.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setMessage("");

    try {
      const res = await fetch("/api/upload-avatar", {
        method: "POST",
        body: formData,
      });

      if (res.redirected) {
        window.location.href = res.url;
      } else {
        const data = await res.json();
        setMessage(data.error || "Error desconocido");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al subir la imagen");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col items-center gap-2"
    >
      <input
        ref={fileInputRef}
        type="file"
        name="avatar"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="text-sm block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
      />

      {/* Botón para subir */}
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
      >
        Guardar Imagen
      </button>

      {message && <p className="text-sm text-red-500">{message}</p>}
    </form>
  );
}
