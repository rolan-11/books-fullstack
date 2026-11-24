import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Book } from "../models/book.model.js";

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const available = typeof req.query.available === "string" ? req.query.available : "";
    const sort = typeof req.query.sort === "string" ? req.query.sort : "newest";

    const page = Math.max(1, parseInt(String(req.query.page ?? "1"), 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit ?? "6"), 10) || 6));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapedSearch, "i");
      filter.$or = [{ title: regex }, { author: regex }];
    }

    if (available === "true") {
      filter.available = true;
    } else if (available === "false") {
      filter.available = false;
    }

    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      title_asc: { title: 1 },
    };
    const sortQuery = sortOptions[sort] ?? sortOptions.newest;

    const [books, total] = await Promise.all([
      Book.find(filter).sort(sortQuery).skip(skip).limit(limit),
      Book.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.json({
      data: books,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los libros", error });
  }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "ID de libro inválido" });
      return;
    }

    const book = await Book.findById(id);

    if (!book) {
      res.status(404).json({ message: "Libro no encontrado" });
      return;
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el libro", error });
  }
};

export const createBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el libro", error });
  }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "ID de libro inválido" });
      return;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedBook) {
      res.status(404).json({ message: "Libro no encontrado" });
      return;
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el libro", error });
  }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);

    if (!mongoose.isValidObjectId(id)) {
      res.status(400).json({ message: "ID de libro inválido" });
      return;
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      res.status(404).json({ message: "Libro no encontrado" });
      return;
    }

    res.json({ message: "Libro eliminado correctamente", book: deletedBook });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el libro", error });
  }
};