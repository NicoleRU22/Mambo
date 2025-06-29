import express from 'express';
import prisma from '../config/prismaClient.js';
import { OrderStatus } from '@prisma/client';
import { validateId } from '../middleware/validation.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/orders - Obtener pedidos del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    const where = { userId };
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    const total = await prisma.order.count({ where });

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// GET /api/orders/:id - Obtener detalles de un pedido
router.get('/:id', authenticateToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findFirst({
      where: { id: parseInt(id), userId },
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: parseInt(id) },
    });

    res.json({
      order,
      items: orderItems,
    });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ error: 'Error al obtener detalles del pedido' });
  }
});

// GET /api/orders/admin/all - Obtener todos los pedidos (solo admin)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    const total = await prisma.order.count({ where });

    // Map orders to include customer_name and customer_email
    const mappedOrders = orders.map(order => ({
      ...order,
      customer_name: order.user?.name,
      customer_email: order.user?.email,
    }));

    res.json({
      orders: mappedOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ error: 'Error al obtener pedidos' });
  }
});

// GET /api/orders/admin/:id - Obtener detalles de pedido (admin)
router.get('/admin/:id', authenticateToken, requireAdmin, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: { select: { name: true, email: true, phone: true } },
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
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
    console.error('Get admin order details error:', error);
    res.status(500).json({ error: 'Error al obtener detalles del pedido' });
  }
});

// PUT /api/orders/:id/status - Actualizar estado del pedido (solo admin)
router.put('/:id/status', authenticateToken, requireAdmin, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const order = await prisma.order.findUnique({ where: { id: parseInt(id) } });
    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status, updatedAt: new Date() },
    });

    res.json({
      message: 'Estado del pedido actualizado',
      order_id: id,
      new_status: status,
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Error al actualizar estado del pedido' });
  }
});

// GET /api/orders/stats/summary - Estadísticas de pedidos (admin)
router.get('/stats/summary', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Total de pedidos
    const totalOrders = await prisma.order.count();

    // Pedidos por estado
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
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
      orders_by_status: ordersByStatus.map(s => ({
        status: s.status,
        count: s._count.status,
      })),
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
