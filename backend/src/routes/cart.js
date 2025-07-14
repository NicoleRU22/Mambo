import express from "express";
import { validateCartItem, validateId } from "../middleware/validation.js";
import { authenticateToken, optionalAuth } from "../middleware/auth.js";
import prisma from "../lib/prisma.js";

const router = express.Router();

/**
 * GET /api/cart
 * Obtiene el carrito del usuario (autenticado u opcional)
 */
router.get("/", optionalAuth, async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.json({
      items: [],
      summary: { subtotal: 0, shipping: 0, total: 0, itemCount: 0 },
    });
  }

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
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
      orderBy: { updatedAt: "desc" },
    });

    const items = cartItems
      .filter((ci) => ci.product !== null)
      .map((ci) => ({
        id: ci.id,
        product_id: ci.productId,
        product_name: ci.product.name,
        price: ci.product.price,
        quantity: ci.quantity,
        stock: ci.product.stock,
        image: ci.product.images[0] || null,
        size: ci.size,
        color: ci.colors,
      }));

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal > 50 ? 0 : 8.99;
    const total = subtotal + shipping;

    res.json({
      items,
      summary: {
        subtotal: +subtotal.toFixed(2),
        shipping: +shipping.toFixed(2),
        total: +total.toFixed(2),
        itemCount: items.length,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener carrito" });
  }
});

/**
 * POST /api/cart
 * Agrega o actualiza un item en el carrito
 */
router.post("/", authenticateToken, validateCartItem, async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity, size, color } = req.body;

  // 1) Verifico existencia y stock
  const product = await prisma.product.findUnique({
    where: { id: product_id },
    select: { stock: true, sizes: true, colors: true, isActive: true },
  });
  if (!product?.isActive) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  if (size && !product.sizes.includes(size)) {
    return res.status(400).json({ error: "Talla no válida" });
  }
  if (color && !product.colors.includes(color)) {
    return res.status(400).json({ error: "Color no válido" });
  }
  if (product.stock < quantity) {
    return res.status(400).json({ error: "Stock insuficiente" });
  }

  // 2) Veo si ya existe en carrito (mismo userId, productId, size y color)
  const existing = await prisma.cartItem.findFirst({
    where: {
      userId,
      productId: product_id,
      size: size || null,
      colors: color || null,
    },
  });

  if (existing) {
    // actualizo cantidad
    const newQty = existing.quantity + quantity;
    if (newQty > product.stock) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: newQty },
    });
    return res.json({ message: "Cantidad actualizada en el carrito" });
  } else {
    // creo nuevo
    await prisma.cartItem.create({
      data: {
        userId,
        productId: product_id,
        quantity,
        size: size || null,
        colors: color || null,
      },
    });
    res.json({ message: "Producto agregado al carrito" });
  }
});

/**
 * PUT /api/cart/:id
 * Actualiza la cantidad de un item ya existente
 */
router.put("/:id", authenticateToken, validateId, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return res.status(400).json({ error: "Cantidad válida requerida" });
  }

  // Verifico que exista y que me pertenezca
  const existing = await prisma.cartItem.findFirst({
    where: { id: Number(id), userId },
    include: { product: { select: { stock: true } } },
  });
  if (!existing) {
    return res.status(404).json({ error: "Item no encontrado" });
  }
  if (quantity > existing.product.stock) {
    return res.status(400).json({ error: "Stock insuficiente" });
  }

  await prisma.cartItem.update({
    where: { id: Number(id) },
    data: { quantity },
  });

  res.json({ message: "Cantidad actualizada" });
});

/**
 * DELETE /api/cart/:id
 * Elimina un item del carrito
 */
router.delete("/:id", authenticateToken, validateId, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existing = await prisma.cartItem.findFirst({
    where: { id: Number(id), userId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Item no encontrado" });
  }

  await prisma.cartItem.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Item eliminado del carrito" });
});

/**
 * DELETE /api/cart
 * Vacía completamente el carrito del usuario
 */
router.delete("/", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  await prisma.cartItem.deleteMany({ where: { userId } });
  res.json({ message: "Carrito vaciado" });
});

/**
 * POST /api/cart/checkout
 * (ejemplo simplificado) Procesa el pago y crea el pedido
 */
router.post("/checkout", authenticateToken, async (req, res) => {
  // Aquí implementarías tu lógica de checkout / Culqi...
  res.status(501).json({ error: "No implementado" });
});

/**
 * POST /api/cart/sync
 * Sincroniza un carrito local con la BD al loguearse
 */
router.post("/sync", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const items = req.body.items || [];
  for (const { product_id, quantity, size, color } of items) {
    const product = await prisma.product.findUnique({
      where: { id: product_id },
    });
    if (!product) continue; // ❌ Saltar si no existe

    const existing = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId: product_id,
        size: size || null,
        colors: color || null,
      },
    });

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          userId,
          productId: product_id,
          quantity,
          size: size || null,
          colors: color || null,
        },
      });
    }
  }
  res.json({ message: "Carrito sincronizado correctamente" });
});

export default router;
