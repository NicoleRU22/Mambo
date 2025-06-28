import { verifyToken } from "../lib/jwt.js";
import prisma from "../lib/db.js";

const getMe = async (req, res) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }

    const payload = await verifyToken(token); // { sub: userId }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("❌ Error en /api/auth/me:", err.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

module.exports = { getMe };
