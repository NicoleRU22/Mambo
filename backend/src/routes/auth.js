const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { validateLogin, validateRegister } = require("../middleware/validation");
const { authenticateToken } = require("../middleware/auth");

const prisma = new PrismaClient();
const router = express.Router();

// POST /api/auth/register
router.post(
  "/register",
  (req, res, next) => {
    console.log("[DEBUG] Datos recibidos en /register:", req.body);
    next(); // ✅ Ahora sí existe `next`
  },
  validateRegister,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Verificar si el email ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(400).json({ error: "Email ya registrado" });
      }

      // Encriptar contraseña
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Crear usuario
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          // role: 'user' // si tienes el campo role y quieres asignar por defecto
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      // Generar token JWT
      const token = jwt.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      res.status(201).json({
        message: "Usuario registrado exitosamente",
        user: newUser,
        token,
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Error al registrar usuario" });
    }
  }
);

// POST /api/auth/login
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Generar token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Remover contraseña de la respuesta
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: "Login exitoso",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// GET /api/auth/me
router.get("/me", authenticateToken, async (req, res) => {
  try {
    // Obtener usuario desde la base de datos usando el id del token
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    res.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ error: "Error al obtener datos del usuario" });
  }
});

// POST /api/auth/logout
router.post("/logout", authenticateToken, (req, res) => {
  // En una implementación más robusta, podrías invalidar el token
  // Por ahora, solo devolvemos un mensaje de éxito
  res.json({ message: "Logout exitoso" });
});

// POST /api/auth/refresh
router.post("/refresh", authenticateToken, async (req, res) => {
  try {
    // Generar nuevo token
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      message: "Token renovado",
      token,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({ error: "Error al renovar token" });
  }
});

module.exports = router;
