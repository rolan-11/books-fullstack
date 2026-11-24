import { Router } from "express";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} from "../controllers/book.controller.js";
import { validate } from "../middlewares/validate.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { createBookSchema, updateBookSchema } from "../schemas/book.schema.js";

const router = Router();

// Rutas públicas (cualquiera puede ver los libros)
router.get("/", getBooks);
router.get("/:id", getBookById);

// Rutas privadas (requieren haber iniciado sesión)
router.post("/", requireAuth, validate(createBookSchema), createBook);
router.put("/:id", requireAuth, validate(updateBookSchema), updateBook);

// Ruta protegida por rol (solo usuarios con role: "admin")
router.delete("/:id", requireAuth, requireRole("admin"), deleteBook);

export default router;