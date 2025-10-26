import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Balance.css";
import csvData from "../assets/BankTestDB.csv?raw";
import { parseExpenses } from "../utils/csvParser";

export default function Balance() {
  const [expenses, setExpenses] = useState([]);
  const [startingAmount, setStartingAmount] = useState(() => {
    const saved = localStorage.getItem('startingAmount');
    return saved ? parseFloat(saved) : 0;
  });
  const [showAmountInput, setShowAmountInput] = useState(startingAmount === 0);
  const [tempAmount, setTempAmount] = useState('');
  
  // Category allocations
  const [needs, setNeeds] = useState(0);
  const [wants, setWants] = useState(0);
  const [savings, setSavings] = useState(0);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, startingAmount]);

  const loadExpenses = () => {
    try {
      const parsedExpenses = parseExpenses(csvData);
      // Sort by date (most recent first)
      parsedExpenses.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA;
      });
      
      // Load saved categories from localStorage
      const savedCategories = JSON.parse(localStorage.getItem('expenseCategories') || '{}');
      const expensesWithCategories = parsedExpenses.map((expense, index) => ({
        ...expense,
        id: index,
        category: savedCategories[index] || 'uncategorized'
      }));
      
      setExpenses(expensesWithCategories);
    } catch (error) {
      console.error("Error loading expenses:", error);
      alert("Error al cargar los gastos del archivo CSV");
    }
  };

  const calculateCategories = () => {
    let needsTotal = 0;
    let wantsTotal = 0;
    
    expenses.forEach(expense => {
      if (expense.category === 'needs') {
        needsTotal += expense.amount;
      } else if (expense.category === 'wants') {
        wantsTotal += expense.amount;
      }
    });

    setNeeds(needsTotal);
    setWants(wantsTotal);
    
    // Calculate savings (remaining after needs and wants)
    const totalSpent = needsTotal + wantsTotal;
    let savingsAmount = startingAmount - totalSpent;
    
    // If wants overspent, take from savings
    if (wantsTotal > startingAmount * 0.3) { // Assuming 30% budget for wants
      const overspent = wantsTotal - (startingAmount * 0.3);
      savingsAmount = Math.max(0, savingsAmount - overspent);
    }
    
    setSavings(Math.max(0, savingsAmount));
  };

  const handleSetAmount = () => {
    const amount = parseFloat(tempAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Por favor ingresa un monto válido');
      return;
    }
    setStartingAmount(amount);
    localStorage.setItem('startingAmount', amount.toString());
    setShowAmountInput(false);
  };

  const handleCategoryChange = (expenseId, category) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === expenseId ? { ...expense, category } : expense
    );
    setExpenses(updatedExpenses);
    
    // Save to localStorage
    const categories = {};
    updatedExpenses.forEach(expense => {
      categories[expense.id] = expense.category;
    });
    localStorage.setItem('expenseCategories', JSON.stringify(categories));
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

  const uncategorizedExpenses = expenses.filter(e => e.category === 'uncategorized');
  const totalSpent = needs + wants;

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

      {/* AMOUNT INPUT MODAL */}
      {showAmountInput && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%'
          }}>
            <h2 style={{ color: '#1b365d', marginBottom: '1rem' }}>
              💰 Ingresa tu Presupuesto
            </h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>
              ¿Cuánto dinero tienes disponible para administrar?
            </p>
            <input
              type="number"
              step="0.01"
              value={tempAmount}
              onChange={(e) => setTempAmount(e.target.value)}
              placeholder="Ej: 10000"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1.1rem',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
              autoFocus
            />
            <button
              onClick={handleSetAmount}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#1b365d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* BALANCE OVERVIEW */}
      {!showAmountInput && (
        <>
          <div className="balance-overview">
            <div className="balance-header-info" style={{ textAlign: 'center' }}>
              <h2 style={{ color: 'white' }}>Sistema de Gestión de Dinero</h2>
              <p className="balance-period" style={{ color: 'white' }}>
                Del 1 al 31 de Octubre 2025
              </p>
              <button
                onClick={() => setShowAmountInput(true)}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid white',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                ✏️ Cambiar presupuesto (${startingAmount.toFixed(2)})
              </button>
            </div>

            {/* SUMMARY CARDS */}
            <div className="balance-cards">
              <div className="balance-card needs">
                <h3>Necesidades 🏠</h3>
                <p className="amount">${needs.toFixed(2)}</p>
                <p className="total">Gastos esenciales</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill needs-fill"
                    style={{ width: `${startingAmount > 0 ? (needs / startingAmount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="balance-card wants">
                <h3>Deseos 🎮</h3>
                <p className="amount">${wants.toFixed(2)}</p>
                <p className="total">Gastos opcionales</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill wants-fill"
                    style={{ width: `${startingAmount > 0 ? (wants / startingAmount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="balance-card savings">
                <h3>Ahorros 💰</h3>
                <p className="amount" style={{ color: savings >= 0 ? '#28a745' : '#e41c2d' }}>
                  ${savings.toFixed(2)}
                </p>
                <p className="total">
                  {savings >= 0 ? 'Dinero restante' : 'Sobregiro de deseos'}
                </p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill savings-fill"
                    style={{ width: `${startingAmount > 0 ? Math.max(0, (savings / startingAmount) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Summary Info */}
            <div style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '1rem',
              textAlign: 'center'
            }}>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                <strong>Presupuesto total:</strong> ${startingAmount.toFixed(2)} | 
                <strong> Gastado:</strong> ${totalSpent.toFixed(2)} | 
                <strong> Restante:</strong> ${(startingAmount - totalSpent).toFixed(2)}
              </p>
              {uncategorizedExpenses.length > 0 && (
                <p style={{ color: '#e41c2d', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  ⚠️ Tienes {uncategorizedExpenses.length} gastos sin categorizar
                </p>
              )}
            </div>
          </div>

          {/* EXPENSES LIST */}
          <div className="pending-section">
            <h2>📋 Categoriza tus Gastos ({expenses.length})</h2>
            <p className="pending-subtitle">Selecciona si cada gasto es una Necesidad o un Deseo</p>
            
            {/* Table Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 200px',
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
              <div style={{ textAlign: 'center' }}>Categoría</div>
            </div>

            {/* Expenses List */}
            <div style={{
              background: 'white',
              borderRadius: '0 0 8px 8px',
              overflow: 'hidden'
            }}>
              {expenses.map((expense) => (
                <div 
                  key={expense.id} 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto 200px',
                    gap: '1rem',
                    padding: '1rem',
                    borderBottom: '1px solid #e0e0e0',
                    transition: 'background 0.2s',
                    background: expense.category === 'uncategorized' ? '#fff9e6' : 'white'
                  }}
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
                  <div style={{ 
                    display: 'flex',
                    gap: '0.5rem',
                    alignSelf: 'center'
                  }}>
                    <button
                      onClick={() => handleCategoryChange(expense.id, 'needs')}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: expense.category === 'needs' ? '#28a745' : '#e9ecef',
                        color: expense.category === 'needs' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                    >
                      🏠 Necesidad
                    </button>
                    <button
                      onClick={() => handleCategoryChange(expense.id, 'wants')}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: expense.category === 'wants' ? '#ffc107' : '#e9ecef',
                        color: expense.category === 'wants' ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        transition: 'all 0.2s'
                      }}
                    >
                      🎮 Deseo
                    </button>
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
        </>
      )}
    </div>
  );
}
