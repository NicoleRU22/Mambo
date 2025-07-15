// backend/src/routes/contact.routes.js
import express from "express";
import {
  createMessage,
  replyMessage,
  getMessages, // ✅ Importar
} from "../controllers/contact.controller.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/contact
router.post("/contact", createMessage);

// POST /api/contact/messages/reply/:id  (solo admin)
router.post(
  "/contact/messages/reply/:id",
  authenticateToken,
  requireAdmin,
  replyMessage
);

// GET /api/contact/messages (solo admin)
router.get(
  "/contact/messages",
  authenticateToken,
  requireAdmin,
  getMessages
);

export default router;
