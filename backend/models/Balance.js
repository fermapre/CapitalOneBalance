import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  category: { type: String, enum: ["needs", "wants", "savings"], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now }
});

// 👇 NUEVO: Transacciones pendientes de categorizar
const pendingTransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  merchant: { type: String }, // Ej. "OXXO", "AMAZON"
  originalData: { type: Object } // Datos originales del Excel
});

const balanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
  remaining: {
    needs: { type: Number, required: true },
    wants: { type: Number, required: true },
    savings: { type: Number, required: true },
  },
  periodType: { type: String, enum: ["quincenal", "mensual"], default: "mensual" },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  transactions: [transactionSchema], // ✅ Categorizadas
  pendingTransactions: [pendingTransactionSchema], // 👈 NUEVO: Sin categorizar
  dateCreated: { type: Date, default: Date.now }
});

const Balance = mongoose.model("Balance", balanceSchema);
export default Balance;