// backend/src/middleware/auth.js
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    console.log('[AUTH] Usuario autenticado:', req.user);
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication error" });
  }
};

export const requireAdmin = (req, res, next) => {
  console.log('[AUTH] Verificando rol de usuario:', req.user && req.user.role);
  if (req.user && req.user.role === "ADMIN") {
    return next();
  }
  console.log('[AUTH] Acceso denegado. Usuario no es admin.');
  return res.status(403).json({ error: "Acceso solo para administradores" });
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    next();
  }
};
