import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
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
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        paddingTop: '70px',
        paddingBottom: '60px',
        background: 'linear-gradient(135deg, #1b365d 0%, #0a1f44 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div className="container" style={{
          background: 'white',
          padding: '2.5rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          maxWidth: '450px',
          width: '90%'
        }}>
          <h2 style={{
            textAlign: 'center',
            color: '#1b365d',
            marginBottom: '1.5rem',
            fontSize: '1.8rem'
          }}>Create Account</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1.5rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: loading ? '#ccc' : '#1b365d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s'
              }}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>
          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: '#666'
          }}>
            Already have an account? <a href="/login" style={{color: '#1b365d', fontWeight: '600', textDecoration: 'none'}}>Login</a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}