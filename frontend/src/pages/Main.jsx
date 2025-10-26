import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles.css";
import Landing from "../components/Landing";
import csvData from "../assets/BankTestDB.csv?raw";
import { parseExpenses, calculateTotalExpenses } from "../utils/csvParser";

export default function Main() {
  const navigate = useNavigate();
  const [startingAmount] = useState(10000);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remaining, setRemaining] = useState(startingAmount);

  useEffect(() => {
    try {
      const expenses = parseExpenses(csvData);
      const total = calculateTotalExpenses(expenses);
      setTotalExpenses(total);
      setRemaining(startingAmount - total);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  }, [startingAmount]);

  return (
    <div>
      <Landing />
      
      {/* Budget Overview Card */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        margin: '2rem auto',
        maxWidth: '500px',
        padding: '0 1rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          width: '100%',
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
              <span style={{ fontWeight: '600', color: '#666' }}>Total Gastos:</span>
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
      </div>
    </div>
  );
}
