import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteBook,
  getBooks,
  type Book,
  type BooksQueryParams,
} from "../lib/api";
import { authClient } from "../lib/auth-client";

export function BooksPage() {
  const { data: session } = authClient.useSession();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filtros y búsqueda
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [available, setAvailable] = useState<"" | "true" | "false">("");
  const [sort, setSort] =
    useState<NonNullable<BooksQueryParams["sort"]>>("newest");

  // Paginación
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const userRole =
    (session?.user as { role?: string } | undefined)?.role ?? "user";
  const isAdmin = Boolean(session && userRole === "admin");

  const hasActiveFilters =
    debouncedSearch !== "" || available !== "" || sort !== "newest";

  // Espera 350ms tras dejar de escribir antes de pedirle al backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getBooks({
        search: debouncedSearch,
        available,
        sort,
        page,
        limit,
      });
      setBooks(res.data);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los libros"
      );
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, available, sort, page, limit]);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setAvailable("");
    setSort("newest");
    setPage(1);
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`¿Eliminar el libro "${title}"?`);
    if (!confirmed) return;

    try {
      await deleteBook(id);
      if (books.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadBooks();
      }
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

      {/* Barra de búsqueda y filtros */}
      <div className="filters-bar">
        <input
          type="search"
          className="filter-input"
          placeholder="Buscar por título o autor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={available}
          onChange={(e) => {
            setAvailable(e.target.value as "" | "true" | "false");
            setPage(1);
          }}
        >
          <option value="">Todos los estados</option>
          <option value="true">Solo disponibles</option>
          <option value="false">Solo agotados</option>
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as NonNullable<BooksQueryParams["sort"]>);
            setPage(1);
          }}
        >
          <option value="newest">Más recientes</option>
          <option value="price_asc">Menor precio</option>
          <option value="price_desc">Mayor precio</option>
          <option value="title_asc">Título (A - Z)</option>
        </select>

        <select
          className="filter-select filter-limit"
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={3}>3 por pág.</option>
          <option value={6}>6 por pág.</option>
          <option value={12}>12 por pág.</option>
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleClearFilters}
          >
            Limpiar
          </button>
        )}
      </div>

      {!loading && !error && (
        <p className="results-summary">
          {total === 0
            ? "0 resultados"
            : `Mostrando ${books.length} de ${total} ${
                total === 1 ? "libro" : "libros"
              }`}
        </p>
      )}

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Cargando libros...</div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <h2>
            {hasActiveFilters
              ? "No se encontraron libros con esos filtros"
              : "Todavía no hay libros cargados"}
          </h2>
          <p style={{ marginBottom: "1.25rem" }}>
            {hasActiveFilters
              ? "Probá cambiando la búsqueda o limpiando los filtros."
              : isAdmin
                ? "Cargá el primer libro para estrenar el catálogo."
                : "Cuando un administrador cargue libros aparecerán acá."}
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={handleClearFilters}
              className="btn btn-secondary"
            >
              Limpiar filtros
            </button>
          ) : (
            isAdmin && (
              <Link to="/books/new" className="btn btn-primary">
                Crear primer libro
              </Link>
            )
          )}
        </div>
      ) : (
        <>
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

          {/* Paginador */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                ← Anterior
              </button>

              <span className="pagination-info">
                Página {page} de {totalPages}
              </span>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}