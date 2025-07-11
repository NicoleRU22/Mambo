import express from "express";
import { query } from "../config/database.js";
import { validateCartItem, validateId } from "../middleware/validation.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import prisma from "../lib/prisma.js";

const router = express.Router();

// GET /api/cart - Obtener carrito del usuario
// GET /api/cart
router.get("/", optionalAuth, async (req, res) => {
  const userId = req.user?.id || null;

  if (!userId) {
    return res.status(200).json({
      items: [],
      summary: { subtotal: 0, shipping: 0, total: 0, itemCount: 0 },
    });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId,
        product: { isActive: true },
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
            images: true,
            stock: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const items = cartItems.map((item) => ({
      id: item.id,
      product_id: item.productId,
      product_name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      stock: item.product.stock,
      image: item.product.images?.[0] || null, 
      size: item.size,
      color: item.color,
      isActive: item.isActive,
}));


    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal > 50 ? 0 : 8.99;
    const total = subtotal + shipping;

    res.json({
      items,
      summary: {
        subtotal: parseFloat(subtotal.toFixed(2)),
        shipping: parseFloat(shipping.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        itemCount: items.length,
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

// POST /api/cart - Agregar producto al carrito
router.post("/", optionalAuth, validateCartItem, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity, size, color } = req.body;


    // Verificar que el producto existe y tiene stock (usando Prisma)
    const product = await prisma.product.findFirst({
      where: {
        id: product_id,
        isActive: true,
        colors: {
          has: color,
        },
        sizes: {
          has: size,
        },

      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        colors: true,
        sizes: true,
        isActive: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }

    // Verificar si el producto ya está en el carrito (usando Prisma)
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId: product_id,
        size: size || null,
        color: color || null,
        isActive: true,
      },
    });

    if (existingItem) {
      // Actualizar cantidad
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ error: "Stock insuficiente" });
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          updatedAt: new Date(),      
        },
      });

      res.json({ message: "Cantidad actualizada en el carrito" });
    } else {
      // Agregar nuevo item
      await prisma.cartItem.create({
        data: {
          userId,
          productId: product_id,
          quantity,
          size: size || null,
          color: color || null,
          isActive: true,
        },
      });

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

    // Verificar que el item pertenece al usuario (Prisma)
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: Number(id),
        userId: userId,
      },
    });

    if (!cartItem) {
      return res.status(404).json({ error: "Item no encontrado" });
    }

    await prisma.cartItem.delete({
      where: { id: Number(id) },
    });

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
    const culqiRes = await fetch("https://api.culqi.com/v2/charges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CULQI_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: total * 100, // en céntimos
        currency_code: "PEN",
        email: req.user.email,
        source_id: req.body.culqiToken, // token del frontend
      }),
    });

    const culqiData = await culqiRes.json();

    if (
      culqiData.object !== "charge" ||
      culqiData.outcome.type !== "successful_transaction"
    ) {
      return res.status(400).json({ error: "Pago rechazado" });
    }

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

router.post("/sync", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { items } = req.body;

  try {
    for (const item of items) {
      const { product_id, quantity, size } = item;

      // Busca si ya existe el item en el carrito
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          userId,
          productId: product_id,
          size: size || null,
        },
      });

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity,
            updatedAt: new Date(),
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            userId,
            productId: product_id,
            quantity,
            size: size || null,
          },
        });
      }
    }

    res.json({ message: "Carrito sincronizado correctamente" });
  } catch (error) {
    console.error("Cart sync error:", error);
    res.status(500).json({ error: "Error al sincronizar carrito" });
  }
});

export default router;
