import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api";
import "./../styles.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await AuthAPI.post("/login", form);
      
      // 👇 SAVE TOKEN AND USER
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      alert(`Welcome ${res.data.user.name}`);
      navigate("/main");
    } catch (err) {
      console.error("Login error:", err);
      const serverMsg = err?.response?.data || err?.message || "Login error";
      const display = typeof serverMsg === "string" ? serverMsg : serverMsg?.msg || JSON.stringify(serverMsg);
      alert(display);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
      <p>Don't have an account? <a href="/register">Sign up</a></p>
    </div>
  );
}