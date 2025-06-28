// 📁 backend/controllers/newsletter.controller.ts
import prisma from "../lib/prisma";

export const subscribeNewsletter = async (req, res) => {
  const { name, email, acceptMarketing } = req.body;
  try {
    const subscriber = await prisma.newsletterSubscriber.create({
      data: { name, email, acceptMarketing },
    });
    res.status(201).json(subscriber);
  } catch (error) {
    res.status(400).json({ error: "Ya suscrito o email inválido" });
  }
};

export const getSubscribers = async (_req, res) => {
  const subs = await prisma.newsletterSubscriber.findMany();
  res.json(subs);
};

export const unsubscribeNewsletter = async (req, res) => {
  const { id } = req.params;
  await prisma.newsletterSubscriber.delete({ where: { id } });
  res.status(204).send();
};
