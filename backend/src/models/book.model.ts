import { Schema, model, type InferSchemaType } from "mongoose";

const bookSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    publishedDate: { type: Date, required: true },
    available: { type: Boolean, default: true },
    description: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  }
);

export type IBook = InferSchemaType<typeof bookSchema>;
export const Book = model("Book", bookSchema);