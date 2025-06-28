import express from "express";
import { query } from "../config/database.js";
import { validateCartItem, validateId } from "../middleware/validation.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/cart - Obtener carrito del usuario
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await query(
      `
      SELECT ci.*, p.name, p.price, p.images, p.stock as product_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.is_active = 1
      ORDER BY ci.created_at DESC
    `,
      [userId]
    );

    // Procesar imágenes JSON
    const processedItems = cartItems.map((item) => ({
      ...item,
      images: item.images ? JSON.parse(item.images) : [],
    }));

    // Calcular totales
    const subtotal = processedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 50 ? 0 : 8.99;
    const total = subtotal + shipping;

    res.json({
      items: processedItems,
      summary: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        itemCount: processedItems.length,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

// POST /api/cart - Agregar producto al carrito
router.post("/", authenticateToken, validateCartItem, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity, size } = req.body;

    // Verificar que el producto existe y tiene stock
    const [product] = await query(
      "SELECT id, name, price, stock FROM products WHERE id = ? AND is_active = 1",
      [product_id]
    );

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    // Verificar si el producto ya está en el carrito
    const [existingItem] = await query(
      "SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ? AND size = ?",
      [userId, product_id, size || null]
    );

    if (existingItem) {
      // Actualizar cantidad
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ error: "Stock insuficiente" });
      }

      await query(
        "UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [newQuantity, existingItem.id]
      );

      res.json({ message: "Cantidad actualizada en el carrito" });
    } else {
      // Agregar nuevo item
      await query(
        "INSERT INTO cart_items (user_id, product_id, quantity, size) VALUES (?, ?, ?, ?)",
        [userId, product_id, quantity, size || null]
      );

      res.status(201).json({ message: "Producto agregado al carrito" });
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: "Error al agregar al carrito" });
  }
});

// PUT /api/cart/:id - Actualizar cantidad de item en carrito
router.put("/:id", authenticateToken, validateId, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Cantidad válida requerida" });
    }

    // Verificar que el item pertenece al usuario
    const [cartItem] = await query(
      `
      SELECT ci.*, p.stock as product_stock 
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = ? AND ci.user_id = ?
    `,
      [id, userId]
    );

    if (!cartItem) {
      return res.status(404).json({ error: "Item no encontrado" });
    }

    if (quantity > cartItem.product_stock) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    await query(
      "UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [quantity, id]
    );

    res.json({ message: "Cantidad actualizada" });
  } catch (error) {
    console.error("Update cart item error:", error);
    res.status(500).json({ error: "Error al actualizar item del carrito" });
  }
});

// DELETE /api/cart/:id - Eliminar item del carrito
router.delete("/:id", authenticateToken, validateId, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar que el item pertenece al usuario
    const [cartItem] = await query(
      "SELECT id FROM cart_items WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (!cartItem) {
      return res.status(404).json({ error: "Item no encontrado" });
    }

    await query("DELETE FROM cart_items WHERE id = ?", [id]);

    res.json({ message: "Item eliminado del carrito" });
  } catch (error) {
    console.error("Delete cart item error:", error);
    res.status(500).json({ error: "Error al eliminar item del carrito" });
  }
});

// DELETE /api/cart - Vaciar carrito
router.delete("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    await query("DELETE FROM cart_items WHERE user_id = ?", [userId]);

    res.json({ message: "Carrito vaciado" });
  } catch (error) {
    console.error("Clear cart error:", error);
    res.status(500).json({ error: "Error al vaciar carrito" });
  }
});

// POST /api/cart/checkout - Preparar checkout (mover carrito a pedido)
router.post("/checkout", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_zip_code,
      shipping_phone,
      payment_method,
      notes,
    } = req.body;

    // Obtener items del carrito
    const cartItems = await query(
      `
      SELECT ci.*, p.name, p.price, p.stock as product_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND p.is_active = 1
    `,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    // Verificar stock
    for (const item of cartItems) {
      if (item.quantity > item.product_stock) {
        return res.status(400).json({
          error: `Stock insuficiente para ${item.name}`,
        });
      }
    }

    // Calcular total
    const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 50 ? 0 : 8.99;
    const total = subtotal + shipping;

    // Generar número de pedido
    const orderNumber =
      "MB" + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();

    // Crear pedido
    const [orderResult] = await query(
      `
      INSERT INTO orders (user_id, order_number, total_amount, shipping_address, shipping_city, 
                         shipping_state, shipping_zip_code, shipping_phone, payment_method, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        userId,
        orderNumber,
        total,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_zip_code,
        shipping_phone,
        payment_method,
        notes || null,
      ]
    );

    // Crear items del pedido
    for (const item of cartItems) {
      await query(
        `
        INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, size)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [
          orderResult.insertId,
          item.product_id,
          item.name,
          item.price,
          item.quantity,
          item.size,
        ]
      );

      // Actualizar stock
      await query("UPDATE products SET stock = stock - ? WHERE id = ?", [
        item.quantity,
        item.product_id,
      ]);
    }

    // Vaciar carrito
    await query("DELETE FROM cart_items WHERE user_id = ?", [userId]);

    res.status(201).json({
      message: "Pedido creado exitosamente",
      order: {
        id: orderResult.insertId,
        order_number: orderNumber,
        total: parseFloat(total.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    res.status(500).json({ error: "Error al procesar checkout" });
  }
});

export default router;
