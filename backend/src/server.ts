import "dotenv/config";
import express from "express";
import { toNodeHandler } from "better-auth/node";
import { connectDB } from "./config/db.js";
import { auth } from "./config/auth.js";
import { requireAuth } from "./middlewares/auth.middleware.js";
import bookRoutes from "./routes/book.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.BETTER_AUTH_URL || "http://localhost:5173";

// Permitir peticiones y cookies desde el frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

// IMPORTANTE: las rutas de Better Auth siempre van ANTES de express.json()
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "API de Libros funcionando" });
});

// Ruta privada para ver quién está logueado
app.get("/api/me", requireAuth, (req, res) => {
  res.json({ user: req.user, session: req.session });
});

app.use("/api/books", bookRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();