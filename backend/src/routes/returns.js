import express from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const router = express.Router();
const prisma = new PrismaClient();

const returnSchema = z.object({
  reason: z.string().min(1),
  orderItemId: z.string(),
  userId: z.string(),
});

router.post("/", async (req, res) => {
  try {
    const data = returnSchema.parse(req.body);
    const existing = await prisma.returnRequest.findFirst({
      where: { orderItemId: data.orderItemId },
    });

    if (existing) {
      return res.status(400).json({
        error: "Ya se ha solicitado una devolución para este producto.",
      });
    }

    const request = await prisma.returnRequest.create({
      data: {
        reason: data.reason,
        userId: data.userId,
        orderItemId: data.orderItemId,
        status: "pending",
      },
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("Error al crear devolución:", err);
    res.status(400).json({ error: "Datos inválidos" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const devoluciones = await prisma.returnRequest.findMany({
      where: { userId },
      include: {
        orderItem: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(devoluciones);
  } catch (err) {
    console.error("Error al obtener devoluciones:", err);
    res.status(500).json({ error: "Error interno" });
  }
});

export default router;
