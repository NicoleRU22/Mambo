import express from "express";
import prisma from "../lib/db.js";

const router = express.Router();

// ✅ Obtener todas las categorías con conteo de productos
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
    res.json(categories);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ message: "Error al obtener categorías" });
  }
});

// ✅ Crear categoría
router.post("/", async (req, res) => {
  const { name, description, image } = req.body;

  if (!name) {
    return res.status(400).json({ message: "El nombre es obligatorio" });
  }

  try {
    const category = await prisma.category.create({
      data: {
        name,
        description,
        image,
      },
    });
    res.status(201).json(category);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ message: "Error al crear categoría" });
  }
});

// ✅ Actualizar categoría
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body;

  try {
    const updated = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        image,
      },
    });
    res.json(updated);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    res.status(500).json({ message: "Error al actualizar categoría" });
  }
});

// ✅ Eliminar categoría
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si hay productos relacionados
    const productCount = await prisma.product.count({
      where: { categoryId: parseInt(id) },
    });

    if (productCount > 0) {
      return res
        .status(400)
        .json({
          message:
            "No se puede eliminar una categoría que tiene productos asociados.",
        });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({ message: "Error al eliminar categoría" });
  }
});

export default router;
