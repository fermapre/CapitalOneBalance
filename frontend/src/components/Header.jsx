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
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '70px',
      background: 'linear-gradient(135deg, #1b365d 0%, #0a1f44 100%)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 2rem',
      zIndex: 1000
    }}>
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
              background: location.pathname === '/main' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = location.pathname === '/main' ? 'rgba(255,255,255,0.2)' : 'transparent'}
          >
            🏠 Dashboard
          </button>
          
          <button
            onClick={() => navigate('/balance')}
            style={{
              background: location.pathname === '/balance' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = location.pathname === '/balance' ? 'rgba(255,255,255,0.2)' : 'transparent'}
          >
            💼 Balance
          </button>

          <div style={{
            height: '30px',
            width: '1px',
            background: 'rgba(255,255,255,0.3)'
          }}></div>

          <span style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.9rem'
          }}>
            👋 {user.name || 'User'}
          </span>

          <button
            onClick={handleLogout}
            style={{
              background: '#e41c2d',
              border: 'none',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#c01828'}
            onMouseOut={(e) => e.target.style.background = '#e41c2d'}
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
              background: location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
            onMouseOut={(e) => e.target.style.background = location.pathname === '/' ? 'rgba(255,255,255,0.2)' : 'transparent'}
          >
            Login
          </button>
          
          <button
            onClick={() => navigate('/register')}
            style={{
              background: location.pathname === '/register' ? '#fff' : 'transparent',
              border: '1px solid #fff',
              color: location.pathname === '/register' ? '#1b365d' : '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.95rem',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#fff';
              e.target.style.color = '#1b365d';
            }}
            onMouseOut={(e) => {
              if (location.pathname !== '/register') {
                e.target.style.background = 'transparent';
                e.target.style.color = '#fff';
              }
            }}
          >
            Sign Up
          </button>
        </nav>
      )}
    </header>
  );
}
