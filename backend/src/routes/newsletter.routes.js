// backend/src/routes/newsletter.routes.js
import express from "express";
import { subscribe } from "../controllers/newsletter.controller.js";

const router = express.Router();

// POST /api/newsletter
router.post("/newsletter", subscribe);

export default router;
