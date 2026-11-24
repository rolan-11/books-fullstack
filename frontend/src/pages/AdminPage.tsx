import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteBook, getBooks, type Book } from "../lib/api";
import { authClient } from "../lib/auth-client";

export function AdminPage() {
  const { data: session } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true);
        const res = await getBooks({ limit: 50 });
        setBooks(res.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar los libros"
        );
      } finally {
        setLoading(false);
      }
    };

    void loadBooks();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`¿Eliminar definitivamente "${title}"?`);
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

  const availableCount = books.filter((b) => b.available).length;
  const unavailableCount = books.length - availableCount;

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Panel de Administración</h1>
          <p className="page-subtitle">
            Sesión activa como <strong>{session?.user.email}</strong> (rol
            admin).
          </p>
        </div>

        <Link to="/books/new" className="btn btn-primary">
          + Nuevo libro
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div
        className="books-grid"
        style={{ marginBottom: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        <div className="card">
          <span className="page-subtitle">Total de libros</span>
          <strong style={{ fontSize: "2rem" }}>{books.length}</strong>
        </div>
        <div className="card">
          <span className="page-subtitle">Disponibles</span>
          <strong style={{ fontSize: "2rem", color: "#4ade80" }}>
            {availableCount}
          </strong>
        </div>
        <div className="card">
          <span className="page-subtitle">Agotados</span>
          <strong style={{ fontSize: "2rem", color: "#f87171" }}>
            {unavailableCount}
          </strong>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Cargando catálogo...</div>
      ) : books.length === 0 ? (
        <div className="empty-state">No hay libros registrados todavía.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {books.map((book) => (
            <div
              key={book._id}
              className="card"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div>
                <h2 className="card-title">{book.title}</h2>
                <p className="page-subtitle">
                  {book.author} · ${book.price.toLocaleString("es-AR")} ·{" "}
                  {book.available ? "Disponible" : "Agotado"}
                </p>
              </div>

              <div className="card-actions" style={{ marginTop: 0 }}>
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
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}