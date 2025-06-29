// 📁 src/routes/returnRequests.js
import express from "express";
import prisma from "../config/prismaClient.js";

const router = express.Router();

// GET /api/return-requests
router.get("/", async (req, res) => {
  try {
    const returns = await prisma.returnRequest.findMany({
      include: { orderItem: true },
    });
    res.json(returns);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch return requests" });
  }
});

// POST /api/return-requests
router.post("/", async (req, res) => {
  try {
    const { orderItemId, reason } = req.body;
    const request = await prisma.returnRequest.create({
      data: { orderItemId, reason },
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(400).json({ error: "Failed to create return request" });
  }
});

export default router;