import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    // Buscar el token en el header
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({ msg: "No hay token, acceso denegado" });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "tu_secreto_temporal");
    req.userId = decoded.id; // Guardar el ID del usuario en la request
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token inválido" });
  }
};