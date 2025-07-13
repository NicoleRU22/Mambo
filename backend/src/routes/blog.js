// src/routes/blog.js
import express from "express";
import multer from "multer";
import prisma from "../lib/prisma.js";

const router = express.Router();

// configuramos multer para subir imágenes a /public/uploads
const upload = multer({
  dest: "public/uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB máx
});

// GET /api/blog — devuelve todos los posts
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { date: "desc" },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        date: true,
        category: true,
        image: true,
      },
    });
    res.json(posts);
  } catch (err) {
    console.error("Fetch blog posts error:", err);
    res.status(500).json({ error: "Error al obtener posts del blog" });
  }
});

// POST /api/blog — crea un nuevo post (incluye upload de imagen)
router.post("/", upload.single("imageFile"), async (req, res) => {
  try {
    const {
      category,
      date,
      title,
      description, // lo usaremos como excerpt
      content,
      imageUrl,
    } = req.body;

    // validaciones mínimas
    if (!category || !date || !title || !content) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    // determinamos la URL de la imagen: la que venga por formulario o el archivo subido
    let image = imageUrl;
    if (req.file) {
      // renombra/mueve si quieres; para demo queda así:
      image = `/uploads/${req.file.filename}`;
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        excerpt: description || content.slice(0, 150),
        content,
        date: new Date(date),
        category,
        image,
        status: "PUBLISHED",
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error("Create blog post error:", err);
    res.status(500).json({ error: "Error al crear post del blog" });
  }
});

// PUT /api/blog/:id
router.put("/:id", async (req, res) => {
  const { title, content, date, category, imageUrl, description } = req.body;
  try {
    const updated = await prisma.blogPost.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        content,
        date: new Date(date),
        category,
        image: imageUrl,
        excerpt: description,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error("Error al editar:", err);
    res.status(500).json({ error: "Error al editar post" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar post" });
  }
});

export default router;
