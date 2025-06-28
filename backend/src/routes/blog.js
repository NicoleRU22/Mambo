// 📁 src/routes/blog.js
import express from "express";
import prisma from "../config/prismaClient.js";

const router = express.Router();

// GET /api/blog
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

export default router;