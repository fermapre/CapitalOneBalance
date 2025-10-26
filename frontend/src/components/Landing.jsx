import "./Landing.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Landing() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('user');
            if (raw) setUser(JSON.parse(raw));
        } catch (e) {
            console.warn('Failed to read user from localStorage', e);
        }
    }, []);

    return (
        <div className="landing">
            <div className="top-bar">
                <button className="top-btn" onClick={() => navigate('/main')}>🏠 Main</button>
                {user && (
                  <button className="top-btn" onClick={() => navigate('/balance')}>💼 Balance</button>
                )}
            </div>
            <section className="hero">
                <div className="overlay">
                    <img src={logo} alt="Capital One" className="logo" />
                    <div className="buttons">
                      <button className="primary" onClick={() => navigate('/register')}>Create an account</button>
                      <button className="secondary" onClick={() => navigate('/')}>Log in</button>
                    </div>
                </div>
            </section>
        </div>
    );
}