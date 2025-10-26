import express from "express";
import Balance from "../models/Balance.js";
import { authMiddleware } from "../middleware/auth.js"; // 👈 IMPORTAR

const router = express.Router();

// 👇 AGREGAR authMiddleware a todas las rutas
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { salary, allocations, percentages, periodType } = req.body;
    if (!salary || !allocations || !percentages) {
      return res.status(400).json({ msg: "Datos incompletos" });
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    if (periodType === "quincenal") {
      endDate.setDate(startDate.getDate() + 15);
    } else {
      endDate.setMonth(startDate.getMonth() + 1);
    }

    const newBalance = new Balance({
      userId: req.userId, // 👈 VIENE DEL TOKEN
      salary,
      allocations,
      percentages,
      remaining: allocations,
      periodType,
      startDate,
      endDate
    });

    await newBalance.save();
    res.status(201).json({ msg: "Balance creado", data: newBalance });
  } catch (err) {
    res.status(500).json({ msg: "Error al crear balance", error: err.message });
  }
});

// 👇 NUEVA RUTA: Obtener balance del usuario
router.get("/", authMiddleware, async (req, res) => {
  try {
    const balances = await Balance.find({ userId: req.userId }).sort({ dateCreated: -1 });
    res.json({ data: balances });
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener balances", error: err.message });
  }
});

// Registrar gasto
router.post("/:id/spend", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, description } = req.body;

    const balance = await Balance.findOne({ _id: id, userId: req.userId }); // 👈 VERIFICAR OWNERSHIP
    if (!balance) return res.status(404).json({ msg: "Balance no encontrado" });

    if (balance.remaining[category] < amount) {
      return res.status(400).json({ msg: "Fondos insuficientes en esta categoría" });
    }

    balance.remaining[category] -= amount;
    balance.transactions.push({ category, amount, description });
    await balance.save();

    res.json({ msg: "Transacción registrada", data: balance });
  } catch (err) {
    res.status(500).json({ msg: "Error al registrar gasto", error: err.message });
  }
});

router.post("/reset/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const oldBalance = await Balance.findOne({ _id: id, userId: req.userId }); // 👈 VERIFICAR OWNERSHIP
    if (!oldBalance) return res.status(404).json({ msg: "Balance no encontrado" });

    const newBalance = new Balance({
      userId: req.userId, // 👈 AGREGAR
      salary: oldBalance.salary,
      allocations: oldBalance.allocations,
      percentages: oldBalance.percentages,
      remaining: oldBalance.allocations,
      periodType: oldBalance.periodType,
      startDate: new Date(),
      endDate: new Date()
    });

    if (oldBalance.periodType === "quincenal") {
      newBalance.endDate.setDate(newBalance.startDate.getDate() + 15);
    } else {
      newBalance.endDate.setMonth(newBalance.startDate.getMonth() + 1);
    }

    await newBalance.save();
    res.json({ msg: "Nuevo periodo iniciado", data: newBalance });
  } catch (err) {
    res.status(500).json({ msg: "Error al reiniciar balance", error: err.message });
  }
});

// 🆕 NUEVA RUTA: Categorizar una transacción pendiente
router.post("/:id/categorize/:pendingId", authMiddleware, async (req, res) => {
  try {
    const { id, pendingId } = req.params;
    const { category } = req.body; // "needs" o "wants"

    if (!["needs", "wants", "savings"].includes(category)) {
      return res.status(400).json({ msg: "Categoría inválida" });
    }

    const balance = await Balance.findOne({ _id: id, userId: req.userId });
    if (!balance) {
      return res.status(404).json({ msg: "Balance no encontrado" });
    }

    // Buscar la transacción pendiente
    const pendingIndex = balance.pendingTransactions.findIndex(
      tx => tx._id.toString() === pendingId
    );

    if (pendingIndex === -1) {
      return res.status(404).json({ msg: "Transacción pendiente no encontrada" });
    }

    const pendingTx = balance.pendingTransactions[pendingIndex];

    // Verificar fondos suficientes
    if (balance.remaining[category] < pendingTx.amount) {
      return res.status(400).json({ 
        msg: `Fondos insuficientes en ${category}. Disponible: $${balance.remaining[category]}, Requerido: $${pendingTx.amount}` 
      });
    }

    // RESTAR del balance
    balance.remaining[category] -= pendingTx.amount;

    // MOVER a transacciones categorizadas
    balance.transactions.push({
      category: category,
      amount: pendingTx.amount,
      description: pendingTx.description,
      date: pendingTx.date
    });

    // ELIMINAR de pendientes
    balance.pendingTransactions.splice(pendingIndex, 1);

    await balance.save();

    res.json({
      msg: "Transacción categorizada exitosamente",
      balance: {
        remaining: balance.remaining,
        pendingCount: balance.pendingTransactions.length
      }
    });

  } catch (err) {
    console.error("❌ Error al categorizar:", err);
    res.status(500).json({ msg: "Error al categorizar transacción", error: err.message });
  }
});

// 🆕 NUEVA RUTA: Eliminar transacción pendiente (si no aplica)
router.delete("/:id/pending/:pendingId", authMiddleware, async (req, res) => {
  try {
    const { id, pendingId } = req.params;

    const balance = await Balance.findOne({ _id: id, userId: req.userId });
    if (!balance) {
      return res.status(404).json({ msg: "Balance no encontrado" });
    }

    const pendingIndex = balance.pendingTransactions.findIndex(
      tx => tx._id.toString() === pendingId
    );

    if (pendingIndex === -1) {
      return res.status(404).json({ msg: "Transacción no encontrada" });
    }

    balance.pendingTransactions.splice(pendingIndex, 1);
    await balance.save();

    res.json({
      msg: "Transacción eliminada",
      pendingCount: balance.pendingTransactions.length
    });

  } catch (err) {
    res.status(500).json({ msg: "Error al eliminar", error: err.message });
  }
});

export default router;