import express from "express";
import prisma from "../config/prismaClient.js";
import { OrderStatus } from "@prisma/client";
import { validateId } from "../middleware/validation.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/orders - Obtener pedidos del usuario
// routes/orders.js
router.get("/:id", authenticateToken, validateId, async (req, res) => {
  const orderId = Number(req.params.id);
  const userId = req.user.id;

  // Busca la orden y sus items
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      orderItems: {
        select: {
          id: true,
          productName: true,
          productPrice: true,
          quantity: true,
          // si guardaste imagen en orderItem:
          // productImage: true,
        },
      },
    },
  });

  if (!order) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }

  // Normaliza la salida
  res.json({
    id: order.id,
    orderNumber: order.orderNumber,
    createdAt: order.createdAt,
    total: order.totalAmount,
    status: order.status,
    items: order.orderItems,
  });
});

// GET /api/orders/:id - Obtener detalles de un pedido
router.get("/:id", authenticateToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!order) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: parseInt(id) },
    });

    res.json({
      order,
      items: orderItems,
    });
  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({ error: "Error al obtener detalles del pedido" });
  }
});

// GET /api/orders/admin/all - Obtener todos los pedidos (solo admin)
// routes/orders.js (admin)
router.get("/admin/all", authenticateToken, requireAdmin, async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const where = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { user: { email: { contains: search } } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      orderItems: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });

  const total = await prisma.order.count({ where });

  // Mapea para exponer sólo lo que necesitas en el grid
  const mapped = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customer_name: o.user.name,
    customer_email: o.user.email,
    createdAt: o.createdAt,
    totalAmount: o.totalAmount,
    status: o.status,
    itemCount: o.orderItems.length,
  }));

  res.json({
    orders: mapped,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// GET /api/orders/admin/:id - Obtener detalles de pedido (admin)
router.get(
  "/admin/:id",
  authenticateToken,
  requireAdmin,
  validateId,
  async (req, res) => {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: { select: { name: true, email: true, phone: true } },
        },
      });

      if (!order) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }

      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: parseInt(id) },
      });

      res.json({
        order: {
          ...order,
          customer_name: order.user?.name,
          customer_email: order.user?.email,
          customer_phone: order.user?.phone,
        },
        items: orderItems,
      });
    } catch (error) {
      console.error("Get admin order details error:", error);
      res.status(500).json({ error: "Error al obtener detalles del pedido" });
    }
  }
);

// PUT /api/orders/:id/status - Actualizar estado del pedido (solo admin)
router.put(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  validateId,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Estado inválido" });
      }

      const order = await prisma.order.findUnique({
        where: { id: parseInt(id) },
      });
      if (!order) {
        return res.status(404).json({ error: "Pedido no encontrado" });
      }

      await prisma.order.update({
        where: { id: parseInt(id) },
        data: { status, updatedAt: new Date() },
      });

      res.json({
        message: "Estado del pedido actualizado",
        order_id: id,
        new_status: status,
      });
    } catch (error) {
      console.error("Update order status error:", error);
      res.status(500).json({ error: "Error al actualizar estado del pedido" });
    }
  }
);

// GET /api/orders/stats/summary - Estadísticas de pedidos (admin)
router.get(
  "/stats/summary",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      // Total de pedidos
      const totalOrders = await prisma.order.count();

      // Pedidos por estado
      const ordersByStatus = await prisma.order.groupBy({
        by: ["status"],
        _count: { status: true },
      });

      // Ventas totales
      const totalSalesResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: OrderStatus.cancelled } },
      });
      const totalSales = totalSalesResult._sum.totalAmount || 0;

      // Pedidos del mes actual
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const monthlyOrders = await prisma.order.count({
        where: {
          createdAt: { gte: firstDay, lte: lastDay },
        },
      });

      // Ventas del mes actual
      const monthlySalesResult = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: {
          createdAt: { gte: firstDay, lte: lastDay },
          status: { not: OrderStatus.cancelled },
        },
      });
      const monthlySales = monthlySalesResult._sum.totalAmount || 0;

      res.json({
        summary: {
          total_orders: totalOrders,
          total_sales: totalSales.toFixed(2),
          monthly_orders: monthlyOrders,
          monthly_sales: monthlySales.toFixed(2),
        },
        orders_by_status: ordersByStatus.map((s) => ({
          status: s.status,
          count: s._count.status,
        })),
      });
    } catch (error) {
      console.error("Get order stats error:", error);
      res.status(500).json({ error: "Error al obtener estadísticas" });
    }
  }
);

// GET /api/orders — lista pedidos del usuario
router.get("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: { select: { id: true } }, // si quieres el count
    },
  });
  res.json({
    orders: orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      createdAt: o.createdAt,
      totalAmount: o.totalAmount,
      status: o.status,
      itemCount: o.orderItems.length,
    })),
  });
});

export default router;
