import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api";
import "./../styles.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthAPI.post("/register", form);
      alert(res?.data?.msg || "User registered successfully");
      navigate("/"); // Redirect to login
    } catch (err) {
      console.error("Register error:", err);
      const serverMsg = err?.response?.data || err?.message || "Registration error";
      const display = typeof serverMsg === "string" ? serverMsg : serverMsg?.msg || JSON.stringify(serverMsg);
      alert(display);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          minLength="6"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p>Already have an account? <a href="/">Login</a></p>
    </div>
  );
}