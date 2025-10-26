import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api";
import "./../styles.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post("/login", form);
      alert(`Bienvenido ${res.data.user.name}`);
      // Persist simple session so other pages know the user is logged in
      try {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } catch (e) {
        console.warn('Could not persist user to localStorage', e);
      }
      // Redirect to main after successful login
      navigate("/main");
    } catch (err) {
      console.error("Login error:", err);
      const serverMsg = err?.response?.data || err?.message || "Error al iniciar sesión";
      const display = typeof serverMsg === "string" ? serverMsg : serverMsg?.msg || JSON.stringify(serverMsg);
      alert(display);
    }
  };

  return (
    <div className="container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Entrar</button>
      </form>
      <p>¿No tienes cuenta? <a href="/register">Regístrate</a></p>
    </div>
  );
}
