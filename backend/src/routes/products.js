import express from "express";
import prisma from "../lib/prisma.js";

const router = express.Router();

// Obtener todos los productos activos
router.get("/", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Obtener cantidad total de productos activos
router.get("/count", async (req, res) => {
  try {
    const count = await prisma.product.count({
      where: {
        isActive: true,
      },
    });

    res.json({ count });
  } catch (error) {
    console.error("Error al contar productos:", error);
    res.status(500).json({ error: "Error al contar productos" });
  }
});

// Obtener producto por ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      stock,
      petType,
      images,
      sizes,
      categoryId,
    } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice) || undefined,
        stock: parseInt(stock),
        petType: petType.toUpperCase(),
        images,
        sizes,
        categoryId: categoryId ? parseInt(categoryId) : null,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(500).json({ error: "Error al crear producto" });
  }
});

// Actualizar un producto
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const {
      name,
      description,
      price,
      originalPrice,
      stock,
      petType,
      images,
      sizes,
      categoryId,
      isActive,
    } = req.body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        originalPrice: parseFloat(originalPrice) || undefined,
        stock: parseInt(stock),
        petType: petType.toUpperCase(),
        images,
        sizes,
        categoryId: categoryId ? parseInt(categoryId) : null,
        isActive,
      },
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

// Eliminar un producto (eliminación real)
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    // Eliminar items de carrito relacionados
    await prisma.cartItem.deleteMany({
      where: { productId: id }
    });

    // Ahora sí eliminar el producto
    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

// Obtener todos los productos (sin filtro de isActive) para admin
router.get("/admin/all", async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
    });
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos (admin):", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

export default router;
