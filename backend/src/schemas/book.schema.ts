import { z } from "zod";

export const createBookSchema = z.object({
  title: z.string().trim().min(1, "El título es obligatorio"),
  author: z.string().trim().min(1, "El autor es obligatorio"),
  price: z.coerce.number().min(0, "El precio debe ser mayor o igual a 0"),
  publishedDate: z.coerce.date(),
  available: z.boolean().optional().default(true),
  description: z.string().trim().optional().default(""),
});

export const updateBookSchema = createBookSchema.partial();