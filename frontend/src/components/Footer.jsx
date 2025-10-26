export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      color: '#1b365d',
      padding: '1rem 2rem',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 1000,
      borderTop: '2px solid #1b365d'
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
          <p style={{ margin: 0, color: '#1b365d' }}>
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
              color: '#1b365d',
              textDecoration: 'none',
              transition: 'color 0.3s',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.color = '#0f223e'}
            onMouseOut={(e) => e.target.style.color = '#1b365d'}
          >
            Privacy Policy
          </a>
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            style={{
              color: '#1b365d',
              textDecoration: 'none',
              transition: 'color 0.3s',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.color = '#0f223e'}
            onMouseOut={(e) => e.target.style.color = '#1b365d'}
          >
            Terms of Service
          </a>
          <a 
            href="#" 
            onClick={(e) => e.preventDefault()}
            style={{
              color: '#1b365d',
              textDecoration: 'none',
              transition: 'color 0.3s',
              fontWeight: '500'
            }}
            onMouseOver={(e) => e.target.style.color = '#0f223e'}
            onMouseOut={(e) => e.target.style.color = '#1b365d'}
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}
