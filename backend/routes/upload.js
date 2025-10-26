import express from "express";
import multer from "multer";
import xlsx from "xlsx";
import Balance from "../models/Balance.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.mimetype === "application/vnd.ms-excel") {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos Excel (.xlsx, .xls)"));
    }
  }
});

// 🆕 NUEVA RUTA: Subir transacciones SIN categorizar
router.post("/card-movements", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No se subió ningún archivo" });
    }

    const { balanceId } = req.body;
    if (!balanceId) {
      return res.status(400).json({ msg: "Falta el ID del balance" });
    }

    const balance = await Balance.findOne({ _id: balanceId, userId: req.userId });
    if (!balance) {
      return res.status(404).json({ msg: "Balance no encontrado" });
    }

    // Leer Excel
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log("📊 Movimientos de tarjeta leídos:", data);

    let addedCount = 0;
    let errorCount = 0;
    const errors = [];

    // Procesar cada fila del Excel
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Leer columnas (flexible con mayúsculas/minúsculas)
      const monto = parseFloat(
        row.monto || row.Monto || row.MONTO || 
        row.amount || row.Amount || row.AMOUNT ||
        row.importe || row.Importe
      );
      
      const descripcion = 
        row.descripcion || row.Descripcion || row.DESCRIPCION ||
        row.description || row.Description ||
        row.comercio || row.Comercio || row.merchant ||
        row.concepto || row.Concepto ||
        "Compra sin descripción";
      
      const fechaRaw = 
        row.fecha || row.Fecha || row.FECHA ||
        row.date || row.Date;
      
      // Validar monto
      if (!monto || isNaN(monto) || monto <= 0) {
        errorCount++;
        errors.push(`Fila ${i + 2}: Monto inválido (${monto})`);
        continue;
      }

      // Parsear fecha
      let fecha;
      if (fechaRaw) {
        // Si es número de Excel (serial date)
        if (typeof fechaRaw === 'number') {
          const excelEpoch = new Date(1899, 11, 30);
          fecha = new Date(excelEpoch.getTime() + fechaRaw * 86400000);
        } else {
          fecha = new Date(fechaRaw);
        }
        
        if (isNaN(fecha.getTime())) {
          fecha = new Date(); // Si no se puede parsear, usar fecha actual
        }
      } else {
        fecha = new Date();
      }

      // Agregar a pendientes (SIN categoría)
      balance.pendingTransactions.push({
        amount: monto,
        description: descripcion.trim(),
        date: fecha,
        merchant: descripcion.substring(0, 50), // Primeros 50 caracteres
        originalData: row // Guardar data original por si acaso
      });

      addedCount++;
    }

    // Guardar
    await balance.save();

    res.json({
      msg: "Movimientos cargados exitosamente",
      addedCount,
      errorCount,
      errors: errors.length > 0 ? errors : undefined,
      pendingCount: balance.pendingTransactions.length
    });

  } catch (err) {
    console.error("❌ Error al procesar Excel:", err);
    res.status(500).json({ 
      msg: "Error al procesar el archivo", 
      error: err.message 
    });
  }
});

export default router;