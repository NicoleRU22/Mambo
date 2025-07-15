// backend/src/controllers/newsletter.controller.js
import prisma from "../config/prismaClient.js";
import { sendMail } from "../lib/emailService.js";

export async function subscribe(req, res) {
  try {
    const { name, email } = req.body;
    const sub = await prisma.newsletterSubscriber.create({
      data: { name, email },
    });

    // Correo de bienvenida
    await sendMail(
      email,
      "¡Bienvenido a nuestro newsletter!",
      `<p>Hola ${name || "amigo"},</p>
       <p>Gracias por suscribirte a nuestras ofertas y novedades.</p>`
    );

    res.status(201).json({ message: "Suscripción exitosa", data: sub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "No se pudo suscribir al newsletter" });
  }
}
