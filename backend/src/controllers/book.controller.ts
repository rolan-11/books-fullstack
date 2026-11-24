import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Book } from "../models/book.model.js";

export const getBooks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
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