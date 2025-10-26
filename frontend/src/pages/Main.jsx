import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./../styles.css";
import csvData from "../assets/BankTestDB.csv?raw";
import { parseExpenses } from "../utils/csvParser";
import logo from "../assets/logo.png";

export default function Main() {
  const navigate = useNavigate();
  
  // Sync with Balance page settings
  const [totalMoney] = useState(() => {
    const saved = localStorage.getItem('totalMoney');
    return saved ? parseFloat(saved) : 100000;
  });
  
  const [needsPercent] = useState(() => {
    const saved = localStorage.getItem('needsPercent');
    return saved ? parseFloat(saved) : 40;
  });
  
  const [wantsPercent] = useState(() => {
    const saved = localStorage.getItem('wantsPercent');
    return saved ? parseFloat(saved) : 40;
  });
  
  const savingsPercent = 100 - needsPercent - wantsPercent;
  const needsBudget = (totalMoney * needsPercent) / 100;
  const wantsBudget = (totalMoney * wantsPercent) / 100;
  const savingsBudget = (totalMoney * savingsPercent) / 100;
  
  const [needsSpent, setNeedsSpent] = useState(0);
  const [wantsSpent, setWantsSpent] = useState(0);
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
      
      setNeedsSpent(needsTotal);
      setWantsSpent(wantsTotal);
    } catch (error) {
      console.error("Error parsing CSV:", error);
    }
  }, []);

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
          Logout
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
        {/* Budget Overview Card */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          width: '100%',
          maxWidth: '600px',
          border: '3px solid #1b365d'
        }}>
          <h2 style={{ 
            color: '#1b365d', 
            textAlign: 'center',
            marginBottom: '1.5rem',
            fontSize: '1.5rem'
          }}>
            💰 Budget Overview
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{
              padding: '1rem',
              background: '#e8f5e9',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px solid #28a745'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏠</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Needs</div>
              <div style={{ fontWeight: 'bold', color: '#28a745', fontSize: '1.1rem' }}>
                {needsPercent}%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                ${needsBudget.toLocaleString()}
              </div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: '#fff8e1',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px solid #ffc107'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🎮</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Wants</div>
              <div style={{ fontWeight: 'bold', color: '#ffc107', fontSize: '1.1rem' }}>
                {wantsPercent}%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                ${wantsBudget.toLocaleString()}
              </div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: '#e3f2fd',
              borderRadius: '8px',
              textAlign: 'center',
              border: '2px solid #17a2b8'
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💰</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Savings</div>
              <div style={{ fontWeight: 'bold', color: '#17a2b8', fontSize: '1.1rem' }}>
                {savingsPercent.toFixed(1)}%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                ${savingsBudget.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: '#f8f9fa',
              borderRadius: '8px',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontWeight: '600', color: '#666' }}>Total Available:</span>
              <span style={{ fontWeight: 'bold', color: '#1b365d', fontSize: '1.1rem' }}>
                ${totalMoney.toLocaleString()}
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
              <span style={{ fontWeight: '600', color: '#666' }}>Needs Spent:</span>
              <span style={{ fontWeight: 'bold', color: '#28a745', fontSize: '1.1rem' }}>
                ${needsSpent.toLocaleString()}
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
              <span style={{ fontWeight: '600', color: '#666' }}>Wants Spent:</span>
              <span style={{ fontWeight: 'bold', color: '#ffc107', fontSize: '1.1rem' }}>
                ${wantsSpent.toLocaleString()}
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
              <span style={{ fontWeight: '600', color: '#666' }}>Total Spent:</span>
              <span style={{ fontWeight: 'bold', color: '#e41c2d', fontSize: '1.1rem' }}>
                ${(needsSpent + wantsSpent).toLocaleString()}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: '#d4edda',
              borderRadius: '8px',
              border: '2px solid #28a745'
            }}>
              <span style={{ fontWeight: '600', color: '#333' }}>Remaining Budget:</span>
              <span style={{ 
                fontWeight: 'bold', 
                color: '#28a745',
                fontSize: '1.3rem'
              }}>
                ${(totalMoney - needsSpent - wantsSpent).toLocaleString()}
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
            📊 View Expense Details
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
            Welcome, {user.name || 'User'}! 👋
          </p>
        </div>
      </div>
    </div>
  );
}
