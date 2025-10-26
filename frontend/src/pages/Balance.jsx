import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Balance.css";
import csvData from "../assets/BankTestDB.csv?raw";
import { parseExpenses } from "../utils/csvParser";


export default function Balance() {
  const [expenses, setExpenses] = useState([]);
  
  const [totalMoney, setTotalMoney] = useState(() => {
    const saved = localStorage.getItem('totalMoney');
    return saved ? parseFloat(saved) : 100000;
  });
  
  const [needsPercent, setNeedsPercent] = useState(() => {
    const saved = localStorage.getItem('needsPercent');
    return saved ? parseFloat(saved) : 40;
  });
  const [wantsPercent, setWantsPercent] = useState(() => {
    const saved = localStorage.getItem('wantsPercent');
    return saved ? parseFloat(saved) : 40;
  });
  
  const [showPercentInput, setShowPercentInput] = useState(false);
  const [tempTotalMoney, setTempTotalMoney] = useState(totalMoney.toString());
  const [tempNeedsPercent, setTempNeedsPercent] = useState(needsPercent.toString());
  const [tempWantsPercent, setTempWantsPercent] = useState(wantsPercent.toString());
  
  const savingsPercent = 100 - needsPercent - wantsPercent;
  const needsBudget = (totalMoney * needsPercent) / 100;
  const wantsBudget = (totalMoney * wantsPercent) / 100;
  const savingsBudget = (totalMoney * savingsPercent) / 100;
  
  const [needsSpent, setNeedsSpent] = useState(0);
  const [wantsSpent, setWantsSpent] = useState(0);
  const [needsRemaining, setNeedsRemaining] = useState(needsBudget);
  const [wantsRemaining, setWantsRemaining] = useState(wantsBudget);
  const [savingsRemaining, setSavingsRemaining] = useState(savingsBudget);
  
  const [showCategory, setShowCategory] = useState(null); // 'needs', 'wants', or null

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    calculateBalances();
  }, [expenses, needsPercent, wantsPercent]);

  const loadExpenses = () => {
    try {
      const parsedExpenses = parseExpenses(csvData);
      parsedExpenses.sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateB - dateA;
      });
      
      const savedCategories = JSON.parse(localStorage.getItem('expenseCategories') || '{}');
      const expensesWithCategories = parsedExpenses.map((expense, index) => ({
        ...expense,
        id: index,
        category: savedCategories[index] || 'uncategorized'
      }));
      
      setExpenses(expensesWithCategories);
    } catch (error) {
      console.error("Error loading expenses:", error);
    }
  };

  const calculateBalances = () => {
    let needsTotal = 0;
    let wantsTotal = 0;
    
    expenses.forEach(expense => {
      if (expense.category === 'needs') {
        needsTotal += expense.amount;
      } else if (expense.category === 'wants') {
        wantsTotal += expense.amount;
      }
    });

    setNeedsSpent(needsTotal);
    setWantsSpent(wantsTotal);
    
    let needsRem = needsBudget - needsTotal;
    let wantsRem = wantsBudget - wantsTotal;
    let savingsRem = savingsBudget;
    
    if (needsRem < 0) {
      savingsRem += needsRem;
      needsRem = 0;
    }
    
    if (wantsRem < 0) {
      savingsRem += wantsRem;
      wantsRem = 0;
    }
    
    setNeedsRemaining(needsRem);
    setWantsRemaining(wantsRem);
    setSavingsRemaining(Math.max(0, savingsRem));
  };

  const handleSetPercentages = () => {
    const total = parseFloat(tempTotalMoney);
    const needs = parseFloat(tempNeedsPercent);
    const wants = parseFloat(tempWantsPercent);
    
    if (isNaN(total) || total <= 0) {
      alert('Please enter a valid total amount');
      return;
    }
    
    if (isNaN(needs) || isNaN(wants) || needs < 0 || wants < 0) {
      alert('Please enter valid percentages');
      return;
    }
    
    if (needs + wants > 100) {
      alert('The sum of Needs and Wants cannot exceed 100%');
      return;
    }
    
    setTotalMoney(total);
    setNeedsPercent(needs);
    setWantsPercent(wants);
    localStorage.setItem('totalMoney', total.toString());
    localStorage.setItem('needsPercent', needs.toString());
    localStorage.setItem('wantsPercent', wants.toString());
    setShowPercentInput(false);
  };

  const handleCategoryChange = (expenseId, category) => {
    const updatedExpenses = expenses.map(expense => 
      expense.id === expenseId ? { ...expense, category } : expense
    );
    setExpenses(updatedExpenses);
    
    const categories = {};
    updatedExpenses.forEach(expense => {
      categories[expense.id] = expense.category;
    });
    localStorage.setItem('expenseCategories', JSON.stringify(categories));
  };

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
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const uncategorizedExpenses = expenses.filter(e => e.category === 'uncategorized');
  const needsExpenses = expenses.filter(e => e.category === 'needs');
  const wantsExpenses = expenses.filter(e => e.category === 'wants');

  return (
    <>
      <Header />
      <div className="balance-page" style={{paddingTop: '70px', paddingBottom: '60px', minHeight: '100vh'}}>

      {showPercentInput && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000}}>
          <div style={{background: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '450px', width: '90%'}}>
            <h2 style={{color: '#1b365d', marginBottom: '1rem'}}>📊 Configure Your Budget</h2>
            
            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>💵 Total Available Money ($)</label>
              <input type="number" step="0.01" min="0" value={tempTotalMoney} onChange={(e) => setTempTotalMoney(e.target.value)} style={{width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px'}} />
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>🏠 Needs (%)</label>
              <input type="number" step="1" min="0" max="100" value={tempNeedsPercent} onChange={(e) => setTempNeedsPercent(e.target.value)} style={{width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px'}} />
              <p style={{fontSize: '0.85rem', color: '#666', marginTop: '0.25rem'}}>= ${((parseFloat(tempTotalMoney || 0) * parseFloat(tempNeedsPercent || 0)) / 100).toLocaleString()}</p>
            </div>

            <div style={{marginBottom: '1rem'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>🎮 Wants (%)</label>
              <input type="number" step="1" min="0" max="100" value={tempWantsPercent} onChange={(e) => setTempWantsPercent(e.target.value)} style={{width: '100%', padding: '0.75rem', fontSize: '1rem', border: '2px solid #e0e0e0', borderRadius: '8px'}} />
              <p style={{fontSize: '0.85rem', color: '#666', marginTop: '0.25rem'}}>= ${((parseFloat(tempTotalMoney || 0) * parseFloat(tempWantsPercent || 0)) / 100).toLocaleString()}</p>
            </div>

            <div style={{marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight: '600'}}>💰 Savings (%)</label>
              <p style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#17a2b8'}}>{(100 - parseFloat(tempNeedsPercent || 0) - parseFloat(tempWantsPercent || 0)).toFixed(1)}%</p>
              <p style={{fontSize: '0.85rem', color: '#666'}}>= ${((parseFloat(tempTotalMoney || 0) * (100 - parseFloat(tempNeedsPercent || 0) - parseFloat(tempWantsPercent || 0))) / 100).toLocaleString()}</p>
            </div>

            <button onClick={handleSetPercentages} style={{width: '100%', padding: '0.75rem', background: '#1b365d', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginBottom: '0.5rem'}}>Save Configuration</button>
            <button onClick={() => setShowPercentInput(false)} style={{width: '100%', padding: '0.75rem', background: '#e0e0e0', color: '#333', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer'}}>Cancel</button>
          </div>
        </div>
      )}

      <div className="balance-overview">
        <div className="balance-header-info" style={{textAlign: 'center'}}>
          <h2 style={{color: 'white'}}>Money Management System</h2>
          <p className="balance-period" style={{color: 'white'}}>Total Available: ${totalMoney.toLocaleString()}</p>
          <button onClick={() => { setTempTotalMoney(totalMoney.toString()); setTempNeedsPercent(needsPercent.toString()); setTempWantsPercent(wantsPercent.toString()); setShowPercentInput(true); }} style={{marginTop: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid white', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem'}}>✏️ Configure Budget</button>
        </div>

        <div className="balance-cards">
          <div className="balance-card needs" onClick={() => setShowCategory(showCategory === 'needs' ? null : 'needs')} style={{cursor: 'pointer', transition: 'transform 0.2s', border: showCategory === 'needs' ? '3px solid #28a745' : 'none'}}>
            <h3>Needs 🏠 {needsExpenses.length > 0 && `(${needsExpenses.length})`}</h3>
            <p className="amount">${needsRemaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="total">Spent: ${needsSpent.toLocaleString()} of ${needsBudget.toLocaleString()} ({needsPercent}%)</p>
            <div className="progress-bar"><div className="progress-fill needs-fill" style={{width: `${needsBudget > 0 ? (needsSpent / needsBudget) * 100 : 0}%`}}></div></div>
            <p style={{fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic'}}>Click to {showCategory === 'needs' ? 'hide' : 'view'} expenses</p>
          </div>

          <div className="balance-card wants" onClick={() => setShowCategory(showCategory === 'wants' ? null : 'wants')} style={{cursor: 'pointer', transition: 'transform 0.2s', border: showCategory === 'wants' ? '3px solid #ffc107' : 'none'}}>
            <h3>Wants 🎮 {wantsExpenses.length > 0 && `(${wantsExpenses.length})`}</h3>
            <p className="amount">${wantsRemaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="total">Spent: ${wantsSpent.toLocaleString()} of ${wantsBudget.toLocaleString()} ({wantsPercent}%)</p>
            <div className="progress-bar"><div className="progress-fill wants-fill" style={{width: `${wantsBudget > 0 ? (wantsSpent / wantsBudget) * 100 : 0}%`}}></div></div>
            <p style={{fontSize: '0.8rem', color: '#666', marginTop: '0.5rem', fontStyle: 'italic'}}>Click to {showCategory === 'wants' ? 'hide' : 'view'} expenses</p>
          </div>

          <div className="balance-card savings">
            <h3>Savings 💰</h3>
            <p className="amount" style={{color: savingsRemaining >= 0 ? '#28a745' : '#e41c2d'}}>${savingsRemaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
            <p className="total">Budget: ${savingsBudget.toLocaleString()} ({savingsPercent.toFixed(1)}%)</p>
            <div className="progress-bar"><div className="progress-fill savings-fill" style={{width: `${savingsBudget > 0 ? Math.min(100, (savingsRemaining / savingsBudget) * 100) : 0}%`}}></div></div>
            {savingsRemaining < savingsBudget && (<p style={{fontSize: '0.85rem', color: '#e41c2d', marginTop: '0.5rem'}}>⚠️ Used ${(savingsBudget - savingsRemaining).toLocaleString()} from savings to cover overspending</p>)}
          </div>
        </div>

        <div style={{background: 'white', padding: '1rem', borderRadius: '8px', marginTop: '1rem', textAlign: 'center'}}>
          <p style={{color: '#666', fontSize: '0.9rem'}}><strong>Total Spent:</strong> ${(needsSpent + wantsSpent).toLocaleString()} | <strong>Total Remaining:</strong> ${(needsRemaining + wantsRemaining + savingsRemaining).toLocaleString()}</p>
          {uncategorizedExpenses.length > 0 && (<p style={{color: '#e41c2d', fontSize: '0.9rem', marginTop: '0.5rem'}}>⚠️ You have {uncategorizedExpenses.length} uncategorized expense{uncategorizedExpenses.length > 1 ? 's' : ''}</p>)}
        </div>
      </div>

      {/* Category Details Section */}
      {showCategory && (
        <div className="pending-section" style={{marginTop: '2rem'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h2>
              {showCategory === 'needs' ? '🏠 Needs Expenses' : '🎮 Wants Expenses'} 
              ({showCategory === 'needs' ? needsExpenses.length : wantsExpenses.length})
            </h2>
            <button 
              onClick={() => setShowCategory(null)} 
              style={{padding: '0.5rem 1rem', background: '#e0e0e0', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600'}}>
              ✕ Close
            </button>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr auto 100px', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px 8px 0 0', fontWeight: 'bold', color: '#1b365d'}}>
            <div>Description / Date</div>
            <div style={{textAlign: 'right'}}>Amount</div>
            <div style={{textAlign: 'center'}}>Action</div>
          </div>

          <div style={{background: 'white', borderRadius: '0 0 8px 8px', overflow: 'hidden'}}>
            {(showCategory === 'needs' ? needsExpenses : wantsExpenses).map((expense) => (
              <div key={expense.id} style={{display: 'grid', gridTemplateColumns: '1fr auto 100px', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e0e0e0'}}>
                <div>
                  <div style={{fontWeight: '600', color: '#333', marginBottom: '0.25rem'}}>{expense.description}</div>
                  <div style={{fontSize: '0.85rem', color: '#666'}}>{formatDate(expense.date)}</div>
                </div>
                <div style={{color: '#e41c2d', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'right', alignSelf: 'center'}}>-${expense.amount.toFixed(2)}</div>
                <div style={{alignSelf: 'center', textAlign: 'center'}}>
                  <button 
                    onClick={() => handleCategoryChange(expense.id, 'uncategorized')} 
                    style={{padding: '0.5rem', background: '#ff4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600'}}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {((showCategory === 'needs' && needsExpenses.length === 0) || (showCategory === 'wants' && wantsExpenses.length === 0)) && (
            <p style={{textAlign: 'center', color: '#666', padding: '2rem', background: 'white', borderRadius: '0 0 8px 8px'}}>
              No expenses in this category yet
            </p>
          )}
        </div>
      )}

      <div className="pending-section" style={{marginTop: '2rem'}}>
        <h2>📋 Uncategorized Expenses ({uncategorizedExpenses.length})</h2>
        <p className="pending-subtitle">Select whether each expense is a Need or a Want</p>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr auto 200px', gap: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px 8px 0 0', fontWeight: 'bold', color: '#1b365d', marginTop: '1rem'}}>
          <div>Description / Date</div>
          <div style={{textAlign: 'right'}}>Amount</div>
          <div style={{textAlign: 'center'}}>Category</div>
        </div>

        <div style={{background: 'white', borderRadius: '0 0 8px 8px', overflow: 'hidden'}}>
          {uncategorizedExpenses.map((expense) => (
            <div key={expense.id} style={{display: 'grid', gridTemplateColumns: '1fr auto 200px', gap: '1rem', padding: '1rem', borderBottom: '1px solid #e0e0e0', background: '#fff9e6'}}>
              <div>
                <div style={{fontWeight: '600', color: '#333', marginBottom: '0.25rem'}}>{expense.description}</div>
                <div style={{fontSize: '0.85rem', color: '#666'}}>{formatDate(expense.date)}</div>
              </div>
              <div style={{color: '#e41c2d', fontWeight: 'bold', fontSize: '1.1rem', textAlign: 'right', alignSelf: 'center'}}>-${expense.amount.toFixed(2)}</div>
              <div style={{display: 'flex', gap: '0.5rem', alignSelf: 'center'}}>
                <button onClick={() => handleCategoryChange(expense.id, 'needs')} style={{flex: 1, padding: '0.5rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600'}}>🏠 Need</button>
                <button onClick={() => handleCategoryChange(expense.id, 'wants')} style={{flex: 1, padding: '0.5rem', background: '#ffc107', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600'}}>🎮 Want</button>
              </div>
            </div>
          ))}
        </div>

        {uncategorizedExpenses.length === 0 && (<p style={{textAlign: 'center', color: '#666', padding: '2rem', background: 'white', borderRadius: '0 0 8px 8px'}}>All expenses have been categorized! ✅</p>)}
      </div>
    </div>
    <Footer />
    </>
  );
}
