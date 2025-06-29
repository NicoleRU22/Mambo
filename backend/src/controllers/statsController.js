import prisma from "../lib/db.js"; // Asegúrate de tener prisma correctamente exportado

export async function getSummaryStats(req, res) {
  try {
    const users = await prisma.user.count();
    const products = await prisma.product.count();
    const orders = await prisma.order.count();
    const sales = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { paymentStatus: "PAID" },
    });

    res.json({
      users,
      products,
      orders,
      totalSales: sales._sum.totalAmount || 0,
    });
  } catch (error) {
    console.error("Error en estadísticas:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
