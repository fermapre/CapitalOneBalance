import "./Landing.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="landing">
            {/* Top buttons simplified: Main and Balance */}
            <div className="top-bar">
                <button className="top-btn" onClick={() => navigate('/main')}>🏠 Main</button>
                <button className="top-btn" onClick={() => navigate('/balance')}>💼 Balance</button>
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