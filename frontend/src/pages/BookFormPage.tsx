import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBook, getBookById, updateBook } from "../lib/api";

const bookSchema = z.object({
  title: z.string().trim().min(2, "El título debe tener al menos 2 caracteres"),
  author: z.string().trim().min(2, "El autor debe tener al menos 2 caracteres"),
  price: z
    .string()
    .min(1, "El precio es obligatorio")
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
      message: "Ingresá un precio válido mayor o igual a 0",
    }),
  publishedDate: z.string().min(1, "La fecha de publicación es obligatoria"),
  description: z.string().max(500, "Máximo 500 caracteres").optional(),
  available: z.boolean(),
});

type BookFormValues = z.infer<typeof bookSchema>;

export function BookFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: "",
      author: "",
      price: "",
      publishedDate: "",
      description: "",
      available: true,
    },
  });

  useEffect(() => {
    if (!id) return;

    const loadBook = async () => {
      try {
        setLoading(true);
        const book = await getBookById(id);
        reset({
          title: book.title,
          author: book.author,
          price: String(book.price),
          publishedDate: book.publishedDate.slice(0, 10),
          description: book.description || "",
          available: book.available,
        });
      } catch (err) {
        setServerError(
          err instanceof Error ? err.message : "No se pudo cargar el libro"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadBook();
  }, [id, reset]);

  const onSubmit = async (data: BookFormValues) => {
    setServerError("");

    const payload = {
      title: data.title.trim(),
      author: data.author.trim(),
      price: Number(data.price),
      publishedDate: data.publishedDate,
      available: data.available,
      description: (data.description || "").trim(),
    };

    try {
      if (isEditing && id) {
        await updateBook(id, payload);
      } else {
        await createBook(payload);
      }
      navigate("/");
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Error al guardar el libro"
      );
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="empty-state">Cargando datos del libro...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-card">
        <h1 style={{ marginBottom: "0.35rem" }}>
          {isEditing ? "Editar libro" : "Nuevo libro"}
        </h1>
        <p className="page-subtitle" style={{ marginBottom: "1.5rem" }}>
          {isEditing
            ? "Actualizá la información del ejemplar."
            : "Completá los campos para sumarlo al catálogo."}
        </p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              placeholder="Ej: Clean Code"
              {...register("title")}
            />
            {errors.title && (
              <p style={{ color: "#f87171", fontSize: "0.82rem", marginTop: "0.3rem" }}>
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="author">Autor</label>
            <input
              id="author"
              type="text"
              placeholder="Ej: Robert C. Martin"
              {...register("author")}
            />
            {errors.author && (
              <p style={{ color: "#f87171", fontSize: "0.82rem", marginTop: "0.3rem" }}>
                {errors.author.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="15000"
              {...register("price")}
            />
            {errors.price && (
              <p style={{ color: "#f87171", fontSize: "0.82rem", marginTop: "0.3rem" }}>
                {errors.price.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="publishedDate">Fecha de publicación</label>
            <input
              id="publishedDate"
              type="date"
              {...register("publishedDate")}
            />
            {errors.publishedDate && (
              <p style={{ color: "#f87171", fontSize: "0.82rem", marginTop: "0.3rem" }}>
                {errors.publishedDate.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              rows={3}
              placeholder="Resumen breve del libro (opcional)"
              {...register("description")}
            />
            {errors.description && (
              <p style={{ color: "#f87171", fontSize: "0.82rem", marginTop: "0.3rem" }}>
                {errors.description.message}
              </p>
            )}
          </div>

          <label className="checkbox-row">
            <input type="checkbox" {...register("available")} />
            <span>Disponible en stock</span>
          </label>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {isSubmitting
                ? "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Crear libro"}
            </button>

            <Link to="/" className="btn btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}