
import express from "express";
import { getSummaryStats } from "../controllers/statsController.js";
const router = express.Router();

router.get("/summary", getSummaryStats);

export default router;
