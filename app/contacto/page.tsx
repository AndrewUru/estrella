import React, { useState } from "react";

const ContactoPage = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías enviar los datos a una API
    setEnviado(true);
  };

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", padding: "1rem" }}>
      <h1>Contacto</h1>
      {enviado ? (
        <p>¡Gracias por contactarnos! Te responderemos pronto.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12 }}
            />
          </div>
          <div>
            <label htmlFor="email">Correo electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={{ width: "100%", marginBottom: 12 }}
            />
          </div>
          <div>
            <label htmlFor="mensaje">Mensaje:</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              rows={4}
              style={{ width: "100%", marginBottom: 12 }}
            />
          </div>
          <button type="submit">Enviar</button>
        </form>
      )}
    </div>
  );
};

export default ContactoPage;
