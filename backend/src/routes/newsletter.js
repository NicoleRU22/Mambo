
// 📁 src/routes/newsletter.js
import express from "express";
import prisma from "../config/prismaClient.js";

const router = express.Router();

// POST /api/newsletter
router.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    const subscription = await prisma.newsletterSubscription.create({
      data: { email },
    });
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ error: "Already subscribed or invalid email" });
  }
});

export default router;