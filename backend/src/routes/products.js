import express from "express";
import { query } from "../config/database.js";
import {
  validateProduct,
  validateId,
  validateProductQuery,
} from "../middleware/validation.js";
import {
  authenticateToken,
  requireAdmin,
  optionalAuth,
} from "../middleware/auth.js";

const router = express.Router();

// GET /api/products - Obtener todos los productos con filtros
router.get("/", optionalAuth, validateProductQuery, async (req, res) => {
  try {
    const {
      category,
      pet_type,
      min_price,
      max_price,
      search,
      sort = "created_at",
      order = "desc",
      page = 1,
      limit = 12,
    } = req.query;

    let sql = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1
    `;
    const params = [];

    // Aplicar filtros
    if (category) {
      sql += " AND p.category_id = ?";
      params.push(category);
    }

    if (pet_type) {
      sql += " AND p.pet_type = ?";
      params.push(pet_type);
    }

    if (min_price) {
      sql += " AND p.price >= ?";
      params.push(min_price);
    }

    if (max_price) {
      sql += " AND p.price <= ?";
      params.push(max_price);
    }

    if (search) {
      sql += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Contar total de productos
    const countSql = sql.replace(
      "SELECT p.*, c.name as category_name",
      "SELECT COUNT(*) as total"
    );
    const [countResult] = await query(countSql, params);
    const total = countResult.total;

    // Aplicar ordenamiento y paginación
    sql += ` ORDER BY p.${sort} ${order.toUpperCase()}`;
    sql += " LIMIT ? OFFSET ?";
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const products = await query("product", "findMany");

    // Procesar imágenes JSON
    const processedProducts = products.map((product) => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : [],
      sizes: product.sizes ? JSON.parse(product.sizes) : [],
    }));

    res.json({
      products: processedProducts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// GET /api/products/:id - Obtener producto por ID
router.get("/:id", optionalAuth, validateId, async (req, res) => {
  try {
    const { id } = req.params;

    const [product] = await query(
      `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? AND p.is_active = 1
    `,
      [id]
    );

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Procesar imágenes y tallas JSON
    product.images = product.images ? JSON.parse(product.images) : [];
    product.sizes = product.sizes ? JSON.parse(product.sizes) : [];

    res.json({ product });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});

// POST /api/products - Crear producto (solo admin)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  validateProduct,
  async (req, res) => {
    try {
      const {
        name,
        description,
        price,
        original_price,
        category_id,
        pet_type,
        stock,
        images,
        sizes,
      } = req.body;

      const [result] = await query(
        `
      INSERT INTO products (name, description, price, original_price, category_id, pet_type, stock, images, sizes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [
          name,
          description,
          price,
          original_price || null,
          category_id || null,
          pet_type,
          stock || 0,
          images ? JSON.stringify(images) : null,
          sizes ? JSON.stringify(sizes) : null,
        ]
      );

      const [newProduct] = await query("SELECT * FROM products WHERE id = ?", [
        result.insertId,
      ]);

      res.status(201).json({
        message: "Producto creado exitosamente",
        product: {
          ...newProduct,
          images: newProduct.images ? JSON.parse(newProduct.images) : [],
          sizes: newProduct.sizes ? JSON.parse(newProduct.sizes) : [],
        },
      });
    } catch (error) {
      console.error("Create product error:", error);
      res.status(500).json({ error: "Error al crear producto" });
    }
  }
);

// PUT /api/products/:id - Actualizar producto (solo admin)
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  validateId,
  validateProduct,
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        original_price,
        category_id,
        pet_type,
        stock,
        images,
        sizes,
        is_active,
      } = req.body;

      // Verificar que el producto existe
      const [existingProduct] = await query(
        "SELECT id FROM products WHERE id = ?",
        [id]
      );

      if (!existingProduct) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      await query(
        `
      UPDATE products 
      SET name = ?, description = ?, price = ?, original_price = ?, 
          category_id = ?, pet_type = ?, stock = ?, images = ?, 
          sizes = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
        [
          name,
          description,
          price,
          original_price || null,
          category_id || null,
          pet_type,
          stock || 0,
          images ? JSON.stringify(images) : null,
          sizes ? JSON.stringify(sizes) : null,
          is_active !== undefined ? is_active : true,
          id,
        ]
      );

      const [updatedProduct] = await query(
        "SELECT * FROM products WHERE id = ?",
        [id]
      );

      res.json({
        message: "Producto actualizado exitosamente",
        product: {
          ...updatedProduct,
          images: updatedProduct.images
            ? JSON.parse(updatedProduct.images)
            : [],
          sizes: updatedProduct.sizes ? JSON.parse(updatedProduct.sizes) : [],
        },
      });
    } catch (error) {
      console.error("Update product error:", error);
      res.status(500).json({ error: "Error al actualizar producto" });
    }
  }
);

// DELETE /api/products/:id - Eliminar producto (solo admin)
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  validateId,
  async (req, res) => {
    try {
      const { id } = req.params;

      // Verificar que el producto existe
      const [existingProduct] = await query(
        "SELECT id FROM products WHERE id = ?",
        [id]
      );

      if (!existingProduct) {
        return res.status(404).json({ error: "Producto no encontrado" });
      }

      // Soft delete - marcar como inactivo
      await query("UPDATE products SET is_active = 0 WHERE id = ?", [id]);

      res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      console.error("Delete product error:", error);
      res.status(500).json({ error: "Error al eliminar producto" });
    }
  }
);

// GET /api/products/categories - Obtener categorías
// ✅ MANTENER SOLO ESTA
router.get("/categories", async (req, res) => {
  try {
    const categories = await query("SELECT * FROM categories ORDER BY name");
    res.json({ categories });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

export default router;
