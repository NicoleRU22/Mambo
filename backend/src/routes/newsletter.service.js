import prisma from "../lib/db.js";

export const newsletterService = {
  // Suscribir a newsletter
  subscribe: async (subscriberData) => {
    try {
      const subscriber = await prisma.newsletterSubscriber.create({
        data: {
          name: subscriberData.name,
          email: subscriberData.email,
          acceptMarketing: subscriberData.acceptMarketing || false
        }
      });
      return subscriber;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new Error('Este email ya está suscrito al newsletter');
      }
      throw new Error('Error al suscribirse al newsletter');
    }
  },

  // Desuscribir del newsletter
  unsubscribe: async (email) => {
    try {
      const subscriber = await prisma.newsletterSubscriber.delete({
        where: { email }
      });
      return subscriber;
    } catch (error) {
      throw new Error('Error al desuscribirse del newsletter');
    }
  },

  // Obtener todos los suscriptores
  getAllSubscribers: async () => {
    try {
      const subscribers = await prisma.newsletterSubscriber.findMany({
        orderBy: { createdAt: 'desc' }
      });
      return subscribers;
    } catch (error) {
      throw new Error('Error al obtener suscriptores');
    }
  },

  // Obtener suscriptor por email
  getSubscriberByEmail: async (email) => {
    try {
      const subscriber = await prisma.newsletterSubscriber.findUnique({
        where: { email }
      });
      return subscriber;
    } catch (error) {
      throw new Error('Error al obtener suscriptor');
    }
  },

  // Actualizar suscriptor
  updateSubscriber: async (email, updateData) => {
    try {
      const subscriber = await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          name: updateData.name,
          acceptMarketing: updateData.acceptMarketing
        }
      });
      return subscriber;
    } catch (error) {
      throw new Error('Error al actualizar suscriptor');
    }
  },

  // Obtener estadísticas del newsletter
  getNewsletterStats: async () => {
    try {
      const totalSubscribers = await prisma.newsletterSubscriber.count();
      const marketingAccepted = await prisma.newsletterSubscriber.count({
        where: { acceptMarketing: true }
      });
      const recentSubscribers = await prisma.newsletterSubscriber.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 días
          }
        }
      });

      return {
        totalSubscribers,
        marketingAccepted,
        recentSubscribers
      };
    } catch (error) {
      throw new Error('Error al obtener estadísticas del newsletter');
    }
  }
};
