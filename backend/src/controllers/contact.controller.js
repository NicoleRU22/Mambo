import prisma from '../config/prisma.js'; // ajusta la ruta a tu instancia de Prisma

export const getMessages = async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
};

export const sendAutoReply = async (req, res) => {
  const { id } = req.params;

  try {
    const message = await prisma.contactMessage.findUnique({ where: { id: Number(id) } });
    if (!message) return res.status(404).json({ error: 'Mensaje no encontrado' });

    // Aquí puedes enviar un correo real con nodemailer u otro servicio
    console.log(`Enviando respuesta automática a ${message.email}...`);

    res.json({ success: true, message: 'Respuesta automática enviada' });
  } catch (error) {
    console.error("Error al enviar respuesta:", error);
    res.status(500).json({ error: 'No se pudo enviar respuesta' });
  }
};
