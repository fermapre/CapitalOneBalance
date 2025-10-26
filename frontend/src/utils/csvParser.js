// Utility to parse CSV data
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index]?.trim();
    });
    data.push(row);
  }
  
  return data;
};

// Parse expenses from the CSV format
export const parseExpenses = (csvText) => {
  const data = parseCSV(csvText);
  
  return data.map(row => ({
    date: row.fecha,
    description: row.descripcion,
    amount: parseFloat(row.monto) || 0
  }));
};

// Calculate total expenses
export const calculateTotalExpenses = (expenses) => {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
};
