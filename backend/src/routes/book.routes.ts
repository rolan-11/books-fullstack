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

// Rutas públicas (cualquiera puede leer)
router.get("/", getBooks);
router.get("/:id", getBookById);

// Rutas de escritura protegidas (solo rol "admin")
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  validate(createBookSchema),
  createBook
);
router.put(
  "/:id",
  requireAuth,
  requireRole("admin"),
  validate(updateBookSchema),
  updateBook
);
router.delete("/:id", requireAuth, requireRole("admin"), deleteBook);

export default router;