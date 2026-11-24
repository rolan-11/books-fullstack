import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBook, getBooks, type Book } from "../lib/api";
import { authClient } from "../lib/auth-client";

export function BooksPage() {
  const { data: session } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userRole =
    (session?.user as { role?: string } | undefined)?.role ?? "user";
  const isAdmin = Boolean(session && userRole === "admin");

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBooks();
      setBooks(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los libros"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`¿Eliminar el libro "${title}"?`);
    if (!confirmed) return;

    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo eliminar el libro"
      );
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Catálogo de Libros</h1>
          <p className="page-subtitle">
            Explorá los títulos disponibles en la biblioteca.
          </p>
        </div>

        {isAdmin && (
          <Link to="/books/new" className="btn btn-primary">
            + Agregar libro
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando libros...</div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <h2>Todavía no hay libros cargados</h2>
          <p style={{ marginBottom: "1.25rem" }}>
            {isAdmin
              ? "Cargá el primer libro para estrenar el catálogo."
              : "Cuando un administrador cargue libros aparecerán acá."}
          </p>
          {isAdmin && (
            <Link to="/books/new" className="btn btn-primary">
              Crear primer libro
            </Link>
          )}
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <article key={book._id} className="card">
              <div>
                <Link to={`/books/${book._id}`}>
                  <h2 className="card-title">{book.title}</h2>
                </Link>
                <p className="card-author">{book.author}</p>
              </div>

              <p className="card-desc">
                {book.description || "Sin descripción disponible."}
              </p>

              <p style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
                Publicado:{" "}
                {new Date(book.publishedDate).toLocaleDateString("es-AR")}
              </p>

              <div className="card-meta">
                <span className="price">
                  ${book.price.toLocaleString("es-AR")}
                </span>
                <span
                  className={`status-tag ${
                    book.available ? "available" : "unavailable"
                  }`}
                >
                  {book.available ? "Disponible" : "Agotado"}
                </span>
              </div>

              <div className="card-actions">
                <Link
                  to={`/books/${book._id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                >
                  Ver detalle
                </Link>

                {isAdmin && (
                  <>
                    <Link
                      to={`/books/${book._id}/edit`}
                      className="btn btn-secondary btn-sm"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(book._id, book.title)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}