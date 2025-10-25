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

// Login route
router.post("/login", async (req, res) => {
  console.log("📩 Llamada recibida en /login");
  console.log("➡️ Body recibido:", req.body);

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Faltan campos" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("⚠️ Usuario no encontrado:", email);
      return res.status(400).json({ msg: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ Contraseña incorrecta para:", email);
      return res.status(400).json({ msg: "Credenciales inválidas" });
    }

    // Return a safe user object (omit password)
    const safeUser = { id: user._id, name: user.name, email: user.email };
    console.log("✅ Inicio de sesión exitoso:", email);
    res.json({ msg: "Inicio de sesión exitoso", user: safeUser });
  } catch (err) {
    console.error("❌ Error en /login:", err);
    res.status(500).json({ msg: "Error del servidor", error: err.message });
  }
});

export default router;

