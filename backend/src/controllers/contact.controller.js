// backend/src/controllers/contact.controller.js
import prisma from "../config/prismaClient.js";
import { sendMail } from "../lib/emailService.js";

// Al inicio del archivo, solo una vez:
export const getMessages = async (req, res) => {
  console.log("[CONTACT] getMessages llamado por:", req.user);
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(messages);
  } catch (error) {
    console.error("[CONTACT] Error al obtener mensajes:", error);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
};

export async function createMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    // Validaciones básicas
    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    // Validar email simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Correo electrónico inválido" });
    }

    const msg = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });

    // Enviar correo al cliente
    await sendMail(
      email,
      "Gracias por contactarnos",
      `<p>Hola ${name}, hemos recibido tu mensaje:</p>
       <blockquote>${message}</blockquote>
       <p>Te responderemos a la brevedad.</p>`
    );

    // Enviar correo al administrador
    if (process.env.ADMIN_EMAIL) {
      await sendMail(
        process.env.ADMIN_EMAIL,
        `Nuevo mensaje de ${name}`,
        `<p>De: ${name} &lt;${email}&gt;</p>
         <p>Asunto: ${subject}</p>
         <p>${message}</p>`
      );
    } else {
      console.warn("[WARN] ADMIN_EMAIL no definido en .env");
    }

    res.status(201).json({ message: "Mensaje registrado", data: msg });
  } catch (err) {
    console.error("[ERROR] createMessage:", err);
    res.status(500).json({ error: "No se pudo guardar el mensaje" });
  }
}

export async function replyMessage(req, res) {
  try {
    const id = Number(req.params.id);
    const { response } = req.body;
    const msg = await prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) return res.status(404).json({ error: "Mensaje no encontrado" });

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { response, respondedAt: new Date() },
    });

    await sendMail(
      msg.email,
      "Respuesta a tu consulta",
      `<p>Hola ${msg.name},</p>
       <p>${response}</p>
       <hr />
       <p>— Equipo de Mambo Petshop</p>`
    );

    res.json({ message: "Respuesta enviada", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al enviar la respuesta" });
  }
}
