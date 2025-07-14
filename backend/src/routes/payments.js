//src/routes/paymnets.js
import { nanoid } from "nanoid"; //
import express from "express";
import stripe from "../services/stripe.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/create-payment-intent", async (req, res) => {
  const {
    amount,
    currency = "usd",
    userId,
    cartItems,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingZipCode,
    shippingPhone,
    paymentMethod = "CARD", // por defecto puede ser CARD o lo que uses en tu enum
  } = req.body;

  try {
    // 1. Crear PaymentIntent con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId: String(userId) },
    });
    console.log("🛒 Cart Items:", cartItems);
    // 2. Crear orden en la base de datos
    // Validar que todos los productos existan antes de crear orden
    const productIds = cartItems.map((item) => item.productId);
    const existingProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });

    const existingIds = new Set(existingProducts.map((p) => p.id));
    const missingIds = productIds.filter((id) => !existingIds.has(id));

    if (missingIds.length > 0) {
      return res.status(400).json({
        error: `Productos no válidos o inexistentes: ${missingIds.join(", ")}`,
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: nanoid(10),
        status: "PENDING",
        totalAmount: amount / 100,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZipCode,
        shippingPhone,
        paymentMethod,
        paymentStatus: "PENDING",
        user: { connect: { id: userId } },
        paymentIntentId: paymentIntent.id,
        orderItems: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            productName: item.name ?? "Producto",
            productPrice: item.price,
          })),
        },
      },
      include: { orderItems: true },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
  } catch (error) {
    console.error("🔥 Error al crear la orden:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
