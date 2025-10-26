import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'white',
        color: '#1b365d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        borderBottom: '2px solid #1b365d'
      }}
    >
      {/* Logo Section */}
      <div 
        onClick={() => isAuthenticated ? navigate('/main') : navigate('/')} 
        style={{
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <img 
          src={logo} 
          alt="Capital One" 
          style={{ 
            height: '40px',
            width: 'auto'
          }} 
        />
      </div>

      {/* Navigation Links */}
      {isAuthenticated ? (
        <nav style={{
          display: 'flex',
          gap: '1.5rem',
          alignItems: 'center'
        }}>
          <button
            onClick={() => navigate('/main')}
            style={{
              background: location.pathname === '/main' ? '#1b365d' : 'transparent',
              border: '2px solid #1b365d',
              color: location.pathname === '/main' ? 'white' : '#1b365d',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              if (location.pathname !== '/main') {
                e.target.style.background = '#f0f0f0';
              }
            }}
            onMouseOut={(e) => {
              if (location.pathname !== '/main') {
                e.target.style.background = 'transparent';
              }
            }}
          >
            🏠 Dashboard
          </button>
          
          <button
            onClick={() => navigate('/balance')}
            style={{
              background: location.pathname === '/balance' ? '#1b365d' : 'transparent',
              border: '2px solid #1b365d',
              color: location.pathname === '/balance' ? 'white' : '#1b365d',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              if (location.pathname !== '/balance') {
                e.target.style.background = '#f0f0f0';
              }
            }}
            onMouseOut={(e) => {
              if (location.pathname !== '/balance') {
                e.target.style.background = 'transparent';
              }
            }}
          >
            💼 Balance
          </button>

          <div style={{
            height: '30px',
            width: '1px',
            background: '#ccc'
          }}></div>

          <span style={{
            color: '#1b365d',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            👋 {user.name || 'User'}
          </span>

          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '2px solid #1b365d',
              color: '#1b365d',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Logout
          </button>
        </nav>
      ) : (
        <nav style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '2px solid #1b365d',
              color: '#1b365d',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            Login
          </button>
          
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#1b365d',
              border: '2px solid #1b365d',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#0f223e'}
            onMouseOut={(e) => e.target.style.background = '#1b365d'}
          >
            Sign Up
          </button>
        </nav>
      )}
    </header>
  );
}
