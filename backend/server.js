import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import balanceRoutes from "./routes/balance.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch(err => console.error("Error de conexión:", err));

app.use("/api/auth", authRoutes);
app.use("/api/balance", balanceRoutes);


const PORT =  8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
