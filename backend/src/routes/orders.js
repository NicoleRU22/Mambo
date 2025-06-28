import express from 'express';
import { query } from '../config/database.js';
import { validateId } from '../middleware/validation.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/orders - Obtener pedidos del usuario
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;

    let sql = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const orders = await query(sql, params);

    // Contar total de pedidos
    let countSql = 'SELECT COUNT(*) as total FROM orders WHERE user_id = ?';
    const countParams = [userId];
    
    if (status) {
      countSql += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await query(countSql, countParams);
    const total = countResult.total;

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
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

    // Obtener pedido
    const [order] = await query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Obtener items del pedido
    const orderItems = await query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    res.json({
      order,
      items: orderItems
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

    let sql = `
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      sql += ' AND o.status = ?';
      params.push(status);
    }

    if (search) {
      sql += ' AND (o.order_number LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY o.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const orders = await query(sql, params);

    // Contar total
    let countSql = `
      SELECT COUNT(*) as total
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    const countParams = [];

    if (status) {
      countSql += ' AND o.status = ?';
      countParams.push(status);
    }

    if (search) {
      countSql += ' AND (o.order_number LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
      countParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [countResult] = await query(countSql, countParams);
    const total = countResult.total;

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
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

    // Obtener pedido con datos del cliente
    const [order] = await query(`
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `, [id]);

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Obtener items del pedido
    const orderItems = await query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [id]
    );

    res.json({
      order,
      items: orderItems
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

    // Verificar que el pedido existe
    const [order] = await query(
      'SELECT id, status FROM orders WHERE id = ?',
      [id]
    );

    if (!order) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Actualizar estado
    await query(
      'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    res.json({ 
      message: 'Estado del pedido actualizado',
      order_id: id,
      new_status: status
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
    const [totalOrders] = await query('SELECT COUNT(*) as total FROM orders');
    
    // Pedidos por estado
    const ordersByStatus = await query(`
      SELECT status, COUNT(*) as count 
      FROM orders 
      GROUP BY status
    `);

    // Ventas totales
    const [totalSales] = await query('SELECT SUM(total_amount) as total FROM orders WHERE status != "cancelled"');
    
    // Pedidos del mes actual
    const [monthlyOrders] = await query(`
      SELECT COUNT(*) as total 
      FROM orders 
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

    // Ventas del mes actual
    const [monthlySales] = await query(`
      SELECT SUM(total_amount) as total 
      FROM orders 
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
      AND status != "cancelled"
    `);

    res.json({
      summary: {
        total_orders: totalOrders.total,
        total_sales: parseFloat(totalSales.total || 0).toFixed(2),
        monthly_orders: monthlyOrders.total,
        monthly_sales: parseFloat(monthlySales.total || 0).toFixed(2)
      },
      orders_by_status: ordersByStatus
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
