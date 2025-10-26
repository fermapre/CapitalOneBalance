import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Balance.css";
import csvData from "../assets/BankTestDB.csv?raw";
import { parseExpenses, calculateTotalExpenses } from "../utils/csvParser";

export default function Balance() {
  const [expenses, setExpenses] = useState([]);
  const [startingAmount] = useState(10000);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [remaining, setRemaining] = useState(startingAmount);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExpenses = () => {
    try {
      const parsedExpenses = parseExpenses(csvData);
      // Sort by date (most recent first)
      parsedExpenses.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA;
      });
      
      setExpenses(parsedExpenses);
      const total = calculateTotalExpenses(parsedExpenses);
      setTotalExpenses(total);
      setRemaining(startingAmount - total);
    } catch (error) {
      console.error("Error loading expenses:", error);
      alert("Error al cargar los gastos del archivo CSV");
    }
  };

  // Parse date from DD-MMM-YY format
  const parseDate = (dateStr) => {
    try {
      const [day, monthStr, year] = dateStr.split('-');
      const monthMap = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      const month = monthMap[monthStr];
      const fullYear = parseInt('20' + year);
      return new Date(fullYear, month, parseInt(day));
    } catch {
      return new Date();
    }
  };

  const formatDate = (dateStr) => {
    const date = parseDate(dateStr);
    return date.toLocaleDateString('es-MX', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="balance-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <h1>Hola, {user.name || 'Usuario'}! 👋</h1>
        <div className="header-actions">
          <button onClick={() => navigate("/main")} className="btn-secondary">
            ← Volver
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* BALANCE OVERVIEW */}
      <div className="balance-overview">
        <div className="balance-header-info" style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white' }}>Resumen de Gastos</h2>
          <p className="balance-period" style={{ color: 'white' }}>
            Del 1 al 31 de Octubre 2025
          </p>
        </div>

        {/* SUMMARY CARDS */}
        <div className="balance-cards">
          <div className="balance-card needs">
            <h3>Monto Inicial 💵</h3>
            <p className="amount">${startingAmount.toFixed(2)}</p>
            <p className="total">Tu presupuesto base</p>
          </div>

          <div className="balance-card wants">
            <h3>Total Gastado 💸</h3>
            <p className="amount">${totalExpenses.toFixed(2)}</p>
            <p className="total">{expenses.length} transacciones</p>
            <div className="progress-bar">
              <div 
                className="progress-fill wants-fill"
                style={{ width: `${(totalExpenses / startingAmount) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="balance-card savings">
            <h3>Disponible 💰</h3>
            <p className="amount" style={{ color: remaining >= 0 ? '#28a745' : '#e41c2d' }}>
              ${remaining.toFixed(2)}
            </p>
            <p className="total">
              {remaining >= 0 ? 'Dentro del presupuesto' : '¡Presupuesto excedido!'}
            </p>
            <div className="progress-bar">
              <div 
                className="progress-fill savings-fill"
                style={{ width: `${Math.max(0, (remaining / startingAmount) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* EXPENSES LIST */}
      <div className="pending-section">
        <h2>📋 Todos los Gastos ({expenses.length})</h2>
        <p className="pending-subtitle">Movimientos registrados en el archivo CSV</p>
        
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '1rem',
          padding: '1rem',
          background: '#f8f9fa',
          borderRadius: '8px 8px 0 0',
          fontWeight: 'bold',
          color: '#1b365d',
          marginTop: '1rem'
        }}>
          <div>Descripción / Fecha</div>
          <div style={{ textAlign: 'right' }}>Monto</div>
        </div>

        {/* Expenses List */}
        <div style={{
          background: 'white',
          borderRadius: '0 0 8px 8px',
          overflow: 'hidden'
        }}>
          {expenses.map((expense, index) => (
            <div 
              key={index} 
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '1rem',
                padding: '1rem',
                borderBottom: index < expenses.length - 1 ? '1px solid #e0e0e0' : 'none',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
            >
              <div>
                <div style={{ 
                  fontWeight: '600', 
                  color: '#333',
                  marginBottom: '0.25rem'
                }}>
                  {expense.description}
                </div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#666' 
                }}>
                  {formatDate(expense.date)}
                </div>
              </div>
              <div style={{ 
                color: '#e41c2d', 
                fontWeight: 'bold',
                fontSize: '1.1rem',
                textAlign: 'right',
                alignSelf: 'center'
              }}>
                -${expense.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {expenses.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
            No hay gastos registrados
          </p>
        )}
      </div>
    </div>
  );
}
