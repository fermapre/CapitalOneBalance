import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  console.log("📩 Llamada recibida en /register");
  console.log("➡️ Body recibido:", req.body);

  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Faltan campos" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ El usuario ya existe:", email);
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    console.log("✅ Usuario guardado correctamente:", newUser);
    res.status(201).json({ msg: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("❌ Error en /register:", err);
    res.status(500).json({ msg: "Error del servidor", error: err.message });
  }
});

export default router;
