import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ msg: "No hay token, acceso denegado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "tu_secreto_temporal"); 
    req.userId = decoded.id; 
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido" });
  }
};