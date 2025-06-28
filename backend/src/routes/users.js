import express from "express";
import bcrypt from "bcryptjs";
import { query } from "../config/database.js";
import { validateId } from "../middleware/validation.js";
import { authenticateToken, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/users/profile - Obtener perfil del usuario
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [user] = await query(
      "SELECT id, name, email, role, phone, address, city, state, zip_code, created_at FROM users WHERE id = ?",
      [userId]
    );

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

    await query(
      `
      UPDATE users 
      SET name = COALESCE(?, name),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          city = COALESCE(?, city),
          state = COALESCE(?, state),
          zip_code = COALESCE(?, zip_code),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
      [name, phone, address, city, state, zip_code, userId]
    );

    const [updatedUser] = await query(
      "SELECT id, name, email, role, phone, address, city, state, zip_code, created_at FROM users WHERE id = ?",
      [userId]
    );

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
      return res
        .status(400)
        .json({
          error: "La nueva contraseña debe tener al menos 6 caracteres",
        });
    }

    // Obtener contraseña actual
    const [user] = await query("SELECT password FROM users WHERE id = ?", [
      userId,
    ]);

    // Verificar contraseña actual
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      return res.status(400).json({ error: "Contraseña actual incorrecta" });
    }

    // Encriptar nueva contraseña
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await query(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, userId]
    );

    res.json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Error al cambiar contraseña" });
  }
});

// GET /api/users/admin/all - Obtener todos los usuarios (solo admin)
router.get("/admin/all", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    let sql = "SELECT id, name, email, role, created_at FROM users WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND (name LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      sql += " AND role = ?";
      params.push(role);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const users = await query(sql, params);

    // Contar total
    let countSql = "SELECT COUNT(*) as total FROM users WHERE 1=1";
    const countParams = [];

    if (search) {
      countSql += " AND (name LIKE ? OR email LIKE ?)";
      countParams.push(`%${search}%`, `%${search}%`);
    }

    if (role) {
      countSql += " AND role = ?";
      countParams.push(role);
    }

    const [countResult] = await query(countSql, countParams);
    const total = countResult.total;

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
    console.error("Get all users error:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
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

      const [user] = await query(
        "SELECT id, name, email, role, phone, address, city, state, zip_code, created_at FROM users WHERE id = ?",
        [id]
      );

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      res.json({ user });
    } catch (error) {
      console.error("Get user by ID error:", error);
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
      const [existingUser] = await query("SELECT id FROM users WHERE id = ?", [
        id,
      ]);

      if (!existingUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Verificar que el email no esté en uso por otro usuario
      if (email) {
        const [emailUser] = await query(
          "SELECT id FROM users WHERE email = ? AND id != ?",
          [email, id]
        );

        if (emailUser) {
          return res.status(400).json({ error: "Email ya está en uso" });
        }
      }

      // Actualizar usuario
      await query(
        `
      UPDATE users 
      SET name = COALESCE(?, name),
          email = COALESCE(?, email),
          role = COALESCE(?, role),
          phone = COALESCE(?, phone),
          address = COALESCE(?, address),
          city = COALESCE(?, city),
          state = COALESCE(?, state),
          zip_code = COALESCE(?, zip_code),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `,
        [name, email, role, phone, address, city, state, zip_code, id]
      );

      // Obtener usuario actualizado
      const [updatedUser] = await query(
        "SELECT id, name, email, role, phone, address, city, state, zip_code, created_at FROM users WHERE id = ?",
        [id]
      );

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
      const [existingUser] = await query(
        "SELECT id, role FROM users WHERE id = ?",
        [id]
      );

      if (!existingUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // No permitir eliminar el último admin
      if (existingUser.role === "admin") {
        const [adminCount] = await query(
          'SELECT COUNT(*) as count FROM users WHERE role = "admin"',
          []
        );

        if (adminCount.count <= 1) {
          return res
            .status(400)
            .json({ error: "No se puede eliminar el último administrador" });
        }
      }

      // Eliminar usuario
      await query("DELETE FROM users WHERE id = ?", [id]);

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
      // Total de usuarios
      const [totalUsers] = await query("SELECT COUNT(*) as total FROM users");

      // Usuarios por rol
      const usersByRole = await query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);

      // Usuarios registrados este mes
      const [monthlyUsers] = await query(`
      SELECT COUNT(*) as total 
      FROM users 
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `);

      res.json({
        summary: {
          total_users: totalUsers.total,
          monthly_users: monthlyUsers.total,
        },
        users_by_role: usersByRole,
      });
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({ error: "Error al obtener estadísticas" });
    }
  }
);

export default router;

