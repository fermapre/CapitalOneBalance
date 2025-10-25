import { useState } from "react";
import { API } from "../api";
import "./../styles.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/register", form);
      // Clear the form so the user can register another account
      setForm({ name: "", email: "", password: "" });
      // If inputs are controlled, also clear the visible inputs by updating state
      alert(res?.data?.msg || "Usuario registrado correctamente");
    } catch (err) {
      // Provide more detailed error info for debugging and user feedback
      console.error("Registro error:", err);
      const serverMsg = err?.response?.data || err?.message || "Error al registrar";
      // If server sent an object with msg, prefer that
      const display = typeof serverMsg === "string" ? serverMsg : serverMsg?.msg || JSON.stringify(serverMsg);
      alert(display);
    }
  };

  return (
    <div className="container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Nombre"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Registrar</button>
      </form>
      <p>¿Ya tienes cuenta? <a href="/">Inicia sesión</a></p>
    </div>
  );
}
