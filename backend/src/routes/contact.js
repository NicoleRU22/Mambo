// src/routes/contact.js
import express from "express";
import prisma from "../lib/prisma.js";
import nodemailer from "nodemailer";

const router = express.Router();

// GET /api/messages — listas todos los mensajes
router.get("/", async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
});

// POST /api/messages/reply/:id — envía respuesta automática al mensaje
router.post("/reply/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const msg = await prisma.message.findUnique({ where: { id } });
    if (!msg) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }

    // configura tu transporte SMTP en las vars de entorno
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: msg.email,
      subject: `Re: ${msg.subject}`,
      text: `Hola ${msg.name},\n\nGracias por contactarnos. Hemos recibido tu mensaje:\n\n"${msg.message}"\n\nEn breve te responderemos con más detalle.\n\n¡Saludos!\nEl equipo de Mambo PetShop`,
    });

    res.json({ message: "Respuesta automática enviada" });
  } catch (error) {
    console.error("Auto-reply error:", error);
    res.status(500).json({ error: "Error al enviar respuesta automática" });
  }
});

export default router;
