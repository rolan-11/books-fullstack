import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteBook, getBookById, type Book } from "../lib/api";
import { authClient } from "../lib/auth-client";

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: session } = authClient.useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userRole =
    (session?.user as { role?: string } | undefined)?.role ?? "user";
  const isAdmin = Boolean(session && userRole === "admin");

  useEffect(() => {
    if (!id) return;

    const loadBook = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getBookById(id);
        setBook(data);
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

  const handleDelete = async () => {
    if (!book) return;
    const confirmed = window.confirm(`¿Eliminar el libro "${book.title}"?`);
    if (!confirmed) return;

    try {
      await deleteBook(book._id);
      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo eliminar el libro"
      );
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="empty-state">Cargando detalle del libro...</div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>No se encontró el libro</h2>
          <p style={{ marginBottom: "1.25rem" }}>
            {error || "El libro que buscás no existe o fue eliminado."}
          </p>
          <Link to="/" className="btn btn-primary">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ marginBottom: "1.25rem" }}>
        <Link to="/" className="btn btn-secondary btn-sm">
          ← Volver al catálogo
        </Link>
      </div>

      <article className="form-card" style={{ maxWidth: "720px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: "0.25rem" }}>
              {book.title}
            </h1>
            <p className="card-author" style={{ fontSize: "1rem" }}>
              {book.author}
            </p>
          </div>

          <span
            className={`status-tag ${
              book.available ? "available" : "unavailable"
            }`}
          >
            {book.available ? "Disponible" : "Agotado"}
          </span>
        </div>

        <p
          style={{
            color: "var(--muted)",
            marginBottom: "1.5rem",
            lineHeight: 1.7,
          }}
        >
          {book.description || "Este libro no tiene descripción cargada."}
        </p>

        <div
          className="card-meta"
          style={{ marginBottom: isAdmin ? "1.5rem" : 0 }}
        >
          <div>
            <span className="page-subtitle" style={{ display: "block" }}>
              Fecha de publicación
            </span>
            <strong>
              {new Date(book.publishedDate).toLocaleDateString("es-AR")}
            </strong>
          </div>

          <div style={{ textAlign: "right" }}>
            <span className="page-subtitle" style={{ display: "block" }}>
              Precio
            </span>
            <span className="price" style={{ fontSize: "1.35rem" }}>
              ${book.price.toLocaleString("es-AR")}
            </span>
          </div>
        </div>

        {isAdmin && (
          <div className="card-actions">
            <Link
              to={`/books/${book._id}/edit`}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              Editar libro
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Eliminar
            </button>
          </div>
        )}
      </article>
    </div>
  );
}