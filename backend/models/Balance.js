import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  category: { type: String, enum: ["needs", "wants", "savings"], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
});

const balanceSchema = new mongoose.Schema({
  salary: { type: Number, required: true },
  allocations: {
    needs: { type: Number, required: true },
    wants: { type: Number, required: true },
    savings: { type: Number, required: true },
  },
  percentages: {
    needs: { type: Number, required: true },
    wants: { type: Number, required: true },
    savings: { type: Number, required: true },
  },
  remaining: { // 💰 cuánto queda en cada categoría
    needs: { type: Number, required: true },
    wants: { type: Number, required: true },
    savings: { type: Number, required: true },
  },
  periodType: { type: String, enum: ["quincenal", "mensual"], default: "mensual" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  transactions: [transactionSchema], // 🧾 transacciones registradas
  dateCreated: { type: Date, default: Date.now }
});

const Balance = mongoose.model("Balance", balanceSchema);
export default Balance;
