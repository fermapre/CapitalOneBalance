import express from "express";
import Balance from "../models/Balance.js";

const router = express.Router();

// Crear balance inicial
router.post("/", async (req, res) => {
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

router.post("/:id/spend", async (req, res) => {
  try {
    const { id } = req.params;
    const { category, amount, description } = req.body;

    const balance = await Balance.findById(id);
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

router.post("/reset/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const oldBalance = await Balance.findById(id);
    if (!oldBalance) return res.status(404).json({ msg: "Balance no encontrado" });

    // Crea un nuevo balance igual, pero con montos reiniciados
    const newBalance = new Balance({
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

export default router;


