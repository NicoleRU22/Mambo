// routes/contact.js
import express from "express";
import { z } from "zod";

const router = express.Router();
const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

router.post("/", async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);

    // Aquí puedes guardar en BD, enviar email, etc.
    console.log("📩 Nuevo mensaje de contacto:", data);

    return res.status(200).json({ message: "Mensaje recibido con éxito" });
  } catch (err) {
    console.error("❌ Error en contacto:", err);
    return res.status(400).json({ error: "Datos inválidos" });
  }
});

module.exports = router;
