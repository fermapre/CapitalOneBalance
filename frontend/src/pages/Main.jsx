import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles.css";
import csvData from "../assets/BankTestDB.csv?raw";
import { parseExpenses } from "../utils/csvParser";
import logo from "../assets/logo.png";

export default function Main() {
  const navigate = useNavigate();
  const [startingAmount] = useState(() => {
    const saved = localStorage.getItem('startingAmount');
    return saved ? parseFloat(saved) : 10000;
  });
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remaining, setRemaining] = useState(startingAmount);
  const [needs, setNeeds] = useState(0);
  const [wants, setWants] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    try {
      const expenses = parseExpenses(csvData);
      
      // Load saved categories
      const savedCategories = JSON.parse(localStorage.getItem('expenseCategories') || '{}');
      const expensesWithCategories = expenses.map((expense, index) => ({
        ...expense,
        id: index,
        category: savedCategories[index] || 'uncategorized'
      }));
      
      // Calculate totals by category
      let needsTotal = 0;
      let wantsTotal = 0;
      
      expensesWithCategories.forEach(expense => {
        if (expense.category === 'needs') {
          needsTotal += expense.amount;
        } else if (expense.category === 'wants') {
          wantsTotal += expense.amount;
        }
      });
      
      setNeeds(needsTotal);
      setWants(wantsTotal);
      
      const total = needsTotal + wantsTotal;
      setTotalExpenses(total);
      setRemaining(startingAmount - total);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  }, [startingAmount]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1b365d 0%, #0a1f44 100%)'
    }}>
      {/* Top Navigation Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1rem',
        background: 'transparent'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '0.45rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
            onClick={() => navigate('/main')}
          >
            🏠 Main
          </button>
          <button 
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              padding: '0.45rem 0.75rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}
            onClick={() => navigate('/balance')}
          >
            💼 Balance
          </button>
        </div>
        <button 
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
            padding: '0.45rem 0.75rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem'
          }}
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>

      {/* Main Content Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem 1rem',
        gap: '2rem'
      }}>
        {/* Budget Card at the Top */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '500px',
          border: '3px solid #1b365d'
        }}>
          <h2 style={{ 
            color: '#1b365d', 
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '1.5rem'
          }}>
            💰 Tu Presupuesto
          </h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontWeight: '600', color: '#666' }}>Monto Inicial:</span>
              <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '1.1rem' }}>
                ${startingAmount.toFixed(2)}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontWeight: '600', color: '#666' }}>Necesidades:</span>
              <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '1.1rem' }}>
                -${needs.toFixed(2)}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontWeight: '600', color: '#666' }}>Deseos:</span>
              <span style={{ fontWeight: 'bold', color: '#ffc107', fontSize: '1.1rem' }}>
                -${wants.toFixed(2)}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontWeight: '600', color: '#666' }}>Total Gastado:</span>
              <span style={{ fontWeight: 'bold', color: '#e41c2d', fontSize: '1.1rem' }}>
                -${totalExpenses.toFixed(2)}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: remaining >= 0 ? '#d4edda' : '#f8d7da',
              borderRadius: '8px',
              border: `2px solid ${remaining >= 0 ? '#28a745' : '#e41c2d'}`
            }}>
              <span style={{ fontWeight: '600', color: '#333' }}>Disponible:</span>
              <span style={{ 
                fontWeight: 'bold', 
                color: remaining >= 0 ? '#28a745' : '#e41c2d',
                fontSize: '1.3rem'
              }}>
                ${remaining.toFixed(2)}
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/balance')}
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '1rem',
              background: '#1b365d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.target.style.background = '#0f223e'}
            onMouseOut={(e) => e.target.style.background = '#1b365d'}
          >
            📊 Ver Desglose de Gastos
          </button>
        </div>

        {/* Logo Section Below */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <img 
            src={logo} 
            alt="Capital One" 
            style={{ 
              width: '300px',
              maxWidth: '100%'
            }} 
          />
          <p style={{ 
            color: 'white', 
            fontSize: '1.1rem',
            textAlign: 'center'
          }}>
            Bienvenido, {user.name || 'Usuario'}! 👋
          </p>
        </div>
      </div>
    </div>
  );
}
