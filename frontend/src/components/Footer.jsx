export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(135deg, #0a1f44 0%, #1b365d 100%)',
      color: 'rgba(255,255,255,0.8)',
      padding: '1rem 2rem',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto',
        fontSize: '0.9rem'
      }}>
        <div>
          <p style={{ margin: 0 }}>
            © {currentYear} Capital One Balance Tracker. All rights reserved.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            style={{
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.color = '#fff'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            style={{
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.color = '#fff'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
          >
            Terms of Service
          </a>
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            style={{
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.color = '#fff'}
            onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
