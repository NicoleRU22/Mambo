import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import categoryRoutes from "./routes/categories.js";
import returnRoutes from "./routes/returnRequests.js";
import newsletterRoutes from "./routes/newsletter.js";
import blogRoutes from "./routes/blog.js";
import searchRoutes from "./routes/searchLogs.js";
import offersRoutes from "./routes/offers.js";
import healthRoutes from "./routes/health.js";
import returnsRoutes from "./routes/returns.js";
import user from "./routes/users.js";
import contactRoutes from "./routes/contact.routes.js";

// Variables para rutas absolutas en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// CORS
const allowedOrigins = [
  "https://mambopetshop.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir llamadas sin origin (como en Postman)
      if (!origin) return callback(null, true);

      // Limpiar slashes finales para comparar correctamente
      const cleanOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(cleanOrigin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Logging
app.use(morgan("combined"));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas (import dinámico porque son CommonJS o aún no convertidas)
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import userRoutes from "./routes/users.js";
import orderRoutes from "./routes/orders.js";
import cartRoutes from "./routes/cart.js";

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/return", returnRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/offers", offersRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/returns", returnsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

// Health check (mantener para compatibilidad)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Mambo PetShop API is running",
    timestamp: new Date().toISOString(),
  });
});

// Ping
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});
