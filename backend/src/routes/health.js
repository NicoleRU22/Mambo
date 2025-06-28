import express from "express";
import prisma from "../lib/db.js";

const router = express.Router();

// Health check básico
router.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Mambo PetShop API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development"
  });
});

// Health check detallado con verificación de base de datos
router.get("/detailed", async (req, res) => {
  try {
    // Verificar conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`;
    
    // Obtener estadísticas básicas
    const [userCount, productCount, orderCount] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count()
    ]);

    res.json({
      status: "OK",
      message: "Mambo PetShop API is running with database connection",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      database: {
        status: "connected",
        stats: {
          users: userCount,
          products: productCount,
          orders: orderCount
        }
      },
      services: {
        auth: "active",
        products: "active",
        orders: "active",
        cart: "active",
        blog: "active",
        newsletter: "active",
        search: "active",
        offers: "active",
        returns: "active"
      }
    });
  } catch (error) {
    console.error("Health check error:", error);
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed",
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Ping simple
router.get("/ping", (req, res) => {
  res.send("pong");
});

export default router; 