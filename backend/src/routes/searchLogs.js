// 📁 src/routes/searchLogs.js
import express from "express";
import prisma from "../config/prismaClient.js";

const router = express.Router();

// POST /api/search
router.post("/", async (req, res) => {
  try {
    const { keyword, userId } = req.body;
    const log = await prisma.searchLog.create({
      data: { keyword, userId },
    });
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error: "Failed to log search" });
  }
});

export default router;
