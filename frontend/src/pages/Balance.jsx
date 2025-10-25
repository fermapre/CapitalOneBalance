import { useState } from "react";
import "./../styles.css";

export default function Balance() {
  const [salary, setSalary] = useState("");
  const [percents, setPercents] = useState({ needs: 50, wants: 30, savings: 20 });
  const [result, setResult] = useState(null);

  const total = Number(percents.needs) + Number(percents.wants) + Number(percents.savings);

  const handlePercentChange = (e) => {
    const { name, value } = e.target;
    // allow empty string or numeric
    setPercents(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericSalary = parseFloat(salary);
    if (Number.isNaN(numericSalary) || numericSalary <= 0) {
      alert("Introduce un salario válido mayor que 0");
      return;
    }

    if (total !== 100) {
      alert(`Los porcentajes deben sumar 100%. Actualmente suman ${total}%`);
      return;
    }

    const allocations = {
      needs: (numericSalary * Number(percents.needs)) / 100,
      wants: (numericSalary * Number(percents.wants)) / 100,
      savings: (numericSalary * Number(percents.savings)) / 100,
    };

    setResult({ salary: numericSalary, allocations });
  };

  return (
    <div className="container">
      <h2>Balance</h2>

      <form onSubmit={handleSubmit} className="balance-form">
        <label>
          Salario:
          <input
            type="number"
            step="0.01"
            min="0"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="Ej. 2500.00"
          />
        </label>

        <fieldset>
          <legend>Dividir salario en porcentajes (deben sumar 100%)</legend>

          <label>
            Needs (%):
            <input
              type="number"
              name="needs"
              min="0"
              max="100"
              value={percents.needs}
              onChange={handlePercentChange}
            />
          </label>

          <label>
            Wants (%):
            <input
              type="number"
              name="wants"
              min="0"
              max="100"
              value={percents.wants}
              onChange={handlePercentChange}
            />
          </label>

          <label>
            Savings (%):
            <input
              type="number"
              name="savings"
              min="0"
              max="100"
              value={percents.savings}
              onChange={handlePercentChange}
            />
          </label>

          <p>Total: {total}% {total !== 100 && <strong style={{color: 'red'}}> — Debe sumar 100%</strong>}</p>
        </fieldset>

        <button type="submit">Calcular asignaciones</button>
      </form>

      {result && (
        <div className="results">
          <h3>Resultados</h3>
          <p>Salario: {result.salary.toFixed(2)}</p>
          <ul>
            <li>Needs: {result.allocations.needs.toFixed(2)}</li>
            <li>Wants: {result.allocations.wants.toFixed(2)}</li>
            <li>Savings: {result.allocations.savings.toFixed(2)}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

