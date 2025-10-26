import { useState, useEffect } from "react";
import { BalanceAPI, UploadAPI } from "../api";
import { useNavigate } from "react-router-dom";
import "./Balance.css";

export default function Balance() {
  const [balances, setBalances] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para crear balance
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [salary, setSalary] = useState("");
  const [percents, setPercents] = useState({ needs: 50, wants: 30, savings: 20 });
  const [periodType, setPeriodType] = useState("mensual");
  
  // Estados para upload de Excel (movimientos de tarjeta)
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  
  // Estados para transacciones pendientes
  const [showPending, setShowPending] = useState(true);
  
  // Estados para modal de transacciones categorizadas
  const [showTransactions, setShowTransactions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const res = await BalanceAPI.get("/");
      setBalances(res.data.data);
      if (res.data.data.length > 0) {
        setCurrentBalance(res.data.data[0]);
      } else {
        setShowCreateForm(true);
      }
    } catch (err) {
      console.error("Error al cargar balances:", err);
    }
  };

  // ========== CREAR BALANCE ==========
  const handleCreateBalance = async (e) => {
    e.preventDefault();
    const numericSalary = parseFloat(salary);
    const total = Number(percents.needs) + Number(percents.wants) + Number(percents.savings);

    if (Number.isNaN(numericSalary) || numericSalary <= 0) {
      alert("Introduce un salario válido");
      return;
    }

    if (total !== 100) {
      alert(`Los porcentajes deben sumar 100%. Suma: ${total}%`);
      return;
    }

    const allocations = {
      needs: (numericSalary * Number(percents.needs)) / 100,
      wants: (numericSalary * Number(percents.wants)) / 100,
      savings: (numericSalary * Number(percents.savings)) / 100,
    };

    setLoading(true);
    try {
      await BalanceAPI.post("/", {
        salary: numericSalary,
        allocations,
        percentages: percents,
        periodType
      });
      alert("Balance creado exitosamente");
      setShowCreateForm(false);
      fetchBalances();
      setSalary("");
    } catch (err) {
      alert(err.response?.data?.msg || "Error al crear balance");
    } finally {
      setLoading(false);
    }
  };

  // ========== SUBIR EXCEL (MOVIMIENTOS DE TARJETA) ==========
  const handleUploadExcel = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Selecciona un archivo Excel");
      return;
    }
    if (!currentBalance) {
      alert("Primero debes crear un balance");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("balanceId", currentBalance._id);

    setLoading(true);
    setUploadResult(null);

    try {
      const res = await UploadAPI.post("/card-movements", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setUploadResult(res.data);
      alert(`✅ ${res.data.addedCount} movimientos cargados. Ahora categorízalos.`);
      setFile(null);
      document.getElementById("fileInput").value = "";
      setShowUploadForm(false);
      fetchBalances();
    } catch (err) {
      alert(err.response?.data?.msg || "Error al procesar el archivo");
    } finally {
      setLoading(false);
    }
  };

  // ========== CATEGORIZAR TRANSACCIÓN PENDIENTE ==========
  const handleCategorize = async (pendingId, category) => {
    if (!window.confirm(`¿Categorizar como ${category === 'needs' ? 'Necesidad' : 'Extra'}?`)) {
      return;
    }

    setLoading(true);
    try {
      await BalanceAPI.post(`/${currentBalance._id}/categorize/${pendingId}`, {
        category
      });
      alert("Transacción categorizada");
      fetchBalances();
    } catch (err) {
      alert(err.response?.data?.msg || "Error al categorizar");
    } finally {
      setLoading(false);
    }
  };

  // ========== ELIMINAR PENDIENTE ==========
  const handleDeletePending = async (pendingId) => {
    if (!window.confirm("¿Eliminar esta transacción? (No se aplicará al balance)")) {
      return;
    }

    setLoading(true);
    try {
      await BalanceAPI.delete(`/${currentBalance._id}/pending/${pendingId}`);
      alert("Transacción eliminada");
      fetchBalances();
    } catch(err) {
      alert("Error al eliminar");
    } finally {
      setLoading(false);
    }
  };

  // ========== VER TRANSACCIONES POR CATEGORÍA ==========
  const handleShowTransactions = (category) => {
    setSelectedCategory(category);
    setShowTransactions(true);
  };

  const getTransactionsByCategory = () => {
    if (!currentBalance || !selectedCategory) return [];
    return currentBalance.transactions.filter(tx => tx.category === selectedCategory);
  };

  const getCategoryName = (cat) => {
    const names = {
      needs: "Necesidades 🏠",
      wants: "Extras 🎮",
      savings: "Ahorros 💰"
    };
    return names[cat] || cat;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const total = Number(percents.needs) + Number(percents.wants) + Number(percents.savings);
  const pendingCount = currentBalance?.pendingTransactions?.length || 0;

  return (
    <div className="balance-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <h1>Hola, {user.name}! 👋</h1>
        <div className="header-actions">
          <button onClick={() => navigate("/main")} className="btn-secondary">
            ← Volver
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* BALANCE ACTUAL */}
      {currentBalance && (
        <div className="balance-overview">
          <div className="balance-header-info">
            <h2>Tu Balance Actual</h2>
            <p className="balance-period">
              {new Date(currentBalance.startDate).toLocaleDateString()} - {new Date(currentBalance.endDate).toLocaleDateString()}
            </p>
            <p className="balance-salary">Salario: ${currentBalance.salary.toFixed(2)}</p>
            {pendingCount > 0 && (
              <p className="pending-badge">⏳ {pendingCount} transacciones pendientes de categorizar</p>
            )}
          </div>

          {/* TARJETAS CLICKEABLES */}
          <div className="balance-cards">
            <div className="balance-card needs clickable" onClick={() => handleShowTransactions("needs")}>
              <h3>Necesidades 🏠</h3>
              <p className="amount">${currentBalance.remaining.needs.toFixed(2)}</p>
              <p className="total">de ${currentBalance.allocations.needs.toFixed(2)}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill needs-fill"
                  style={{ width: `${(currentBalance.remaining.needs / currentBalance.allocations.needs) * 100}%` }}
                ></div>
              </div>
              <p className="click-hint">Click para ver desglose →</p>
            </div>

            <div className="balance-card wants clickable" onClick={() => handleShowTransactions("wants")}>
              <h3>Extras 🎮</h3>
              <p className="amount">${currentBalance.remaining.wants.toFixed(2)}</p>
              <p className="total">de ${currentBalance.allocations.wants.toFixed(2)}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill wants-fill"
                  style={{ width: `${(currentBalance.remaining.wants / currentBalance.allocations.wants) * 100}%` }}
                ></div>
              </div>
              <p className="click-hint">Click para ver desglose →</p>
            </div>

            <div className="balance-card savings clickable" onClick={() => handleShowTransactions("savings")}>
              <h3>Ahorros 💰</h3>
              <p className="amount">${currentBalance.remaining.savings.toFixed(2)}</p>
              <p className="total">de ${currentBalance.allocations.savings.toFixed(2)}</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill savings-fill"
                  style={{ width: `${(currentBalance.remaining.savings / currentBalance.allocations.savings) * 100}%` }}
                ></div>
              </div>
              <p className="click-hint">Click para ver desglose →</p>
            </div>
          </div>
        </div>
      )}

      {/* BOTONES DE ACCIONES */}
      <div className="action-buttons">
        {!currentBalance && (
          <button onClick={() => setShowCreateForm(!showCreateForm)} className="btn-action create">
            {showCreateForm ? "Cancelar" : "➕ Crear Balance"}
          </button>
        )}
        
        {currentBalance && (
          <>
            <button onClick={() => setShowUploadForm(!showUploadForm)} className="btn-action upload">
              {showUploadForm ? "Cancelar" : "📊 Subir Movimientos de Tarjeta"}
            </button>
            {pendingCount > 0 && (
              <button onClick={() => setShowPending(!showPending)} className="btn-action pending">
                {showPending ? "Ocultar" : "Ver"} Pendientes ({pendingCount})
              </button>
            )}
          </>
        )}
      </div>

      {/* FORMULARIO: CREAR BALANCE */}
      {showCreateForm && (
        <div className="form-card">
          <h2>Crear Nuevo Balance</h2>
          <form onSubmit={handleCreateBalance}>
            <label>
              Salario:
              <input
                type="number"
                step="0.01"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="Ej. 10000"
                required
              />
            </label>

            <label>
              Periodo:
              <select value={periodType} onChange={(e) => setPeriodType(e.target.value)}>
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
              </select>
            </label>

            <fieldset>
              <legend>Dividir salario (debe sumar 100%)</legend>
              <div className="percentage-inputs">
                <label>
                  Necesidades (%):
                  <input
                    type="number"
                    value={percents.needs}
                    onChange={(e) => setPercents({...percents, needs: e.target.value})}
                  />
                </label>
                <label>
                  Extras (%):
                  <input
                    type="number"
                    value={percents.wants}
                    onChange={(e) => setPercents({...percents, wants: e.target.value})}
                  />
                </label>
                <label>
                  Ahorros (%):
                  <input
                    type="number"
                    value={percents.savings}
                    onChange={(e) => setPercents({...percents, savings: e.target.value})}
                  />
                </label>
              </div>
              <p className={`total-percent ${total !== 100 ? 'error' : 'success'}`}>
                Total: {total}%
              </p>
            </fieldset>

            <button type="submit" disabled={loading || total !== 100}>
              {loading ? "Creando..." : "Crear Balance"}
            </button>
          </form>
        </div>
      )}

      {/* FORMULARIO: SUBIR EXCEL */}
      {showUploadForm && (
        <div className="form-card">
          <h2>Subir Movimientos de Tarjeta</h2>
          <p className="instructions">
            Tu Excel debe tener: <strong>fecha</strong>, <strong>descripcion</strong>, <strong>monto</strong>
          </p>
          <p className="instructions">
            Los movimientos se cargarán como "pendientes" para que los categorices manualmente.
          </p>
          
          <form onSubmit={handleUploadExcel}>
            <label>
              Archivo Excel:
              <input
                id="fileInput"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              {file && <span className="file-name">📄 {file.name}</span>}
            </label>

            <button type="submit" disabled={loading || !file}>
              {loading ? "Procesando..." : "Subir Movimientos"}
            </button>
          </form>

          {uploadResult && (
            <div className="upload-result">
              <h3>Resultado:</h3>
              <p>✅ Cargados: {uploadResult.addedCount}</p>
              <p>⏳ Pendientes de categorizar: {uploadResult.pendingCount}</p>
            </div>
          )}
        </div>
      )}

      {/* SECCIÓN: TRANSACCIONES PENDIENTES */}
      {currentBalance && pendingCount > 0 && showPending && (
        <div className="pending-section">
          <h2>Transacciones Pendientes de Categorizar</h2>
          <p className="pending-subtitle">Decide si cada gasto es una Necesidad o un Extra</p>
          
          <div className="pending-list">
            {currentBalance.pendingTransactions.map((tx) => (
              <div key={tx._id} className="pending-item">
                <div className="pending-info">
                  <div className="pending-description">{tx.description}</div>
                  <div className="pending-date">{new Date(tx.date).toLocaleDateString('es-MX')}</div>
                </div>
                <div className="pending-amount">${tx.amount.toFixed(2)}</div>
                <div className="pending-actions">
                  <button 
                    className="btn-categorize needs"
                    onClick={() => handleCategorize(tx._id, "needs")}
                    disabled={loading}
                  >
                    🏠 Necesidad
                  </button>
                  <button 
                    className="btn-categorize wants"
                    onClick={() => handleCategorize(tx._id, "wants")}
                    disabled={loading}
                  >
                    🎮 Extra
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeletePending(tx._id)}
                    disabled={loading}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: DESGLOSE DE TRANSACCIONES CATEGORIZADAS */}
      {showTransactions && (
        <div className="modal-overlay" onClick={() => setShowTransactions(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{getCategoryName(selectedCategory)}</h2>
              <button className="close-btn" onClick={() => setShowTransactions(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              {getTransactionsByCategory().length === 0 ? (
                <p className="no-transactions">No hay transacciones en esta categoría</p>
              ) : (
                <div className="transactions-list">
                  {getTransactionsByCategory().reverse().map((tx, idx) => (
                    <div key={idx} className={`transaction-item ${tx.category}`}>
                      <div className="tx-info">
                        <span className="tx-description">{tx.description || "Sin descripción"}</span>
                        <span className="tx-date">{new Date(tx.date).toLocaleDateString('es-MX')}</span>
                      </div>
                      <div className="tx-amount">-${tx.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="modal-summary">
                <p>Total gastado: <strong>${getTransactionsByCategory().reduce((sum, tx) => sum + tx.amount, 0).toFixed(2)}</strong></p>
                <p>Disponible: <strong>${currentBalance.remaining[selectedCategory].toFixed(2)}</strong></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}