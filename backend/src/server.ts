import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import bookRoutes from "./routes/book.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "API de Libros funcionando" });
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