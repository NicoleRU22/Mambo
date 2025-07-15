// src/routes/users.js 
import express from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prismaClient.js";
import { validateId } from "../middleware/validation.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/users/profile - Obtener perfil del usuario
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Error al obtener perfil" });
  }
});

// PUT /api/users/profile - Actualizar perfil del usuario
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, city, state, zip_code } = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
        address,
        city,
        state,
        zip_code,
        updated_at: new Date(),
      },
    });
    const updatedUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        created_at: true,
      },
    });
    res.json({
      message: "Perfil actualizado exitosamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
});

// PUT /api/users/password - Cambiar contraseña
router.put("/password", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Contraseña actual y nueva contraseña requeridas" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "La nueva contraseña debe tener al menos 6 caracteres",
      });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ error: "Contraseña actual incorrecta" });
    }
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, updated_at: new Date() },
    });
    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Error al cambiar contraseña" });
  }
});

// GET /api/users/admin/all - Obtener todos los usuarios
router.get("/admin/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;
    console.log("🔍 Parámetros recibidos:", { page, limit, search, role });

    const where = {};
    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search.trim(), mode: "insensitive" } },
        { email: { contains: search.trim(), mode: "insensitive" } },
      ];
    }

    if (role && ["admin", "client"].includes(role)) {
      where.role = role;
    }

    console.log("📦 Filtro where:", where);

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true, // 👈 Revisa este nombre
      },
      orderBy: { createdAt: "desc" },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    const total = await prisma.user.count({ where });

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("❌ Error interno en /admin/all:", error);
    res
      .status(500)
      .json({ error: error.message || "Error al obtener usuarios" });
  }
});

// GET /api/users/admin/:id - Obtener usuario por ID (admin)
router.get(
  "/admin/:id",
  authenticateToken,
  requireAdmin,
  validateId,
  async (req, res) => {
    try {
      const { id } = req.params;
      console.log("🧩 Obteniendo usuario con ID:", id);

      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          createdAt: true,
        },
      });

      console.log("✅ Usuario encontrado:", user);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({ user });
    } catch (error) {
      console.error("❌ Get user by ID error:", error); // Aquí deberías ver el error real
      res.status(500).json({ error: "Error al obtener usuario" });
    }
  }
);

// PUT /api/users/admin/:id - Actualizar usuario (admin)
router.put(
  "/admin/:id",
  authenticateToken,
  requireAdmin,
  validateId,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email, role, phone, address, city, state, zip_code } =
        req.body;
      // Verificar que el usuario existe
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!existingUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      // Verificar que el email no esté en uso por otro usuario
      if (email) {
        const emailUser = await prisma.user.findFirst({
          where: {
            email,
            NOT: { id: parseInt(id) },
          },
        });
        if (emailUser) {
          return res.status(400).json({ error: "Email ya está en uso" });
        }
      }
      // Actualizar usuario
      await prisma.user.update({
        where: { id: parseInt(id) },
        data: {
          name,
          email,
          role,
          phone,
          address,
          city,
          state,
          zip_code,
          updated_at: new Date(),
        },
      });
      // Obtener usuario actualizado
      const updatedUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          zip_code: true,
          created_at: true,
        },
      });
      res.json({
        message: "Usuario actualizado exitosamente",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Error al actualizar usuario" });
    }
  }
);

// DELETE /api/users/admin/:id - Eliminar usuario (admin)
router.delete(
  "/admin/:id",
  authenticateToken,
  requireAdmin,
  validateId,
  async (req, res) => {
    try {
      const { id } = req.params;
      // Verificar que el usuario existe
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
      });
      if (!existingUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      // No permitir eliminar el último admin
      if (existingUser.role === "admin") {
        const adminCount = await prisma.user.count({
          where: { role: "admin" },
        });
        if (adminCount <= 1) {
          return res
            .status(400)
            .json({ error: "No se puede eliminar el último administrador" });
        }
      }
      // Eliminar usuario
      await prisma.user.delete({ where: { id: parseInt(id) } });
      res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Error al eliminar usuario" });
    }
  }
);

// GET /api/users/stats/summary - Estadísticas de usuarios (admin)
router.get(
  "/stats/summary",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const totalUsers = await prisma.user.count();

      const usersByRole = await prisma.user.groupBy({
        by: ["role"],
        _count: { role: true },
      });

      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

      const monthlyUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: firstDay,
            lte: lastDay,
          },
        },
      });

      res.json({
        summary: {
          total_users: totalUsers,
          monthly_users: monthlyUsers,
        },
        users_by_role: usersByRole.map((r) => ({
          role: r.role,
          count: r._count.role,
        })),
      });
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({ error: "Error al obtener estadísticas" });
    }
  }
);

export default router;
