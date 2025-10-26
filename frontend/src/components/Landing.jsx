import "./Landing.css";
import logo from "../assets/logo.png";

export default function Landing() {
    return (
        <div className="landing">
            {/*NAV*/}
        <nav className="navbar">
            <div className="navbar-left">
                <ul>
                    <li> About us </li>
                    <li> Credit Cards </li>
                    <li> Checkings and savings </li>
                    <li> Auto </li>
                    <li> Businesses </li>
                    <li> Commercial </li>
                    <li> Benefits and tools </li>
                </ul>
            </div>
        <div className="navbar-right">
            <i className="fas fa-search"></i>
            <i className="fas fa-download"></i>
            <i className="fas fa-star"></i>
        </div>
    </nav>
        <section className="hero">
            <div className="overlay">
                <img src={logo} alt="Capital One" className="logo" />
                <button className="primary">Create an account </button>
                <button className="secondary">Log in </button>
            </div>
        </section>
    </div>
    );
    }