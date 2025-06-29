import express from "express";
import { query } from "../config/database.js";
const router = express.Router();

// GET /api/offers - Listar todas las ofertas activas
router.get("/", async (req, res) => {
  try {
    const offers = await query(`
      SELECT * FROM offers WHERE is_active = 1 ORDER BY created_at DESC
    `);
    res.json(offers);
  } catch (error) {
    console.error("Error al obtener ofertas:", error);
    res.status(500).json({ error: "Error al obtener ofertas" });
  }
});

// GET /api/offers/:id - Detalle de una oferta
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [offer] = await query(
      `SELECT * FROM offers WHERE id = ? AND is_active = 1`,
      [id]
    );
    if (!offer) return res.status(404).json({ error: "Oferta no encontrada" });
    res.json(offer);
  } catch (error) {
    console.error("Error al obtener detalle de oferta:", error);
    res.status(500).json({ error: "Error al obtener detalle de oferta" });
  }
});

export default router;
