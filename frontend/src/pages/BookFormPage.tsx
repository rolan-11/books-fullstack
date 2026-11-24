import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createBook, getBookById, updateBook } from "../lib/api";

export function BookFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [available, setAvailable] = useState(true);
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadBook = async () => {
      try {
        setLoading(true);
        const book = await getBookById(id);
        setTitle(book.title);
        setAuthor(book.author);
        setPrice(String(book.price));
        setPublishedDate(book.publishedDate.slice(0, 10));
        setAvailable(book.available);
        setDescription(book.description || "");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "No se pudo cargar el libro"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadBook();
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      title: title.trim(),
      author: author.trim(),
      price: Number(price),
      publishedDate,
      available,
      description: description.trim(),
    };

    try {
      if (isEditing && id) {
        await updateBook(id, payload);
      } else {
        await createBook(payload);
      }
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al guardar el libro"
      );
    } finally {
      setSaving(false);
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

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Clean Code"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Autor</label>
            <input
              id="author"
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ej: Robert C. Martin"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="15000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="publishedDate">Fecha de publicación</label>
            <input
              id="publishedDate"
              type="date"
              value={publishedDate}
              onChange={(e) => setPublishedDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Resumen breve del libro (opcional)"
            />
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            <span>Disponible en stock</span>
          </label>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {saving
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