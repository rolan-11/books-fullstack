import { Link, NavLink, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const navigate = useNavigate();

  const userRole =
    (session?.user as { role?: string } | undefined)?.role ?? "user";

  const handleSignOut = async () => {
    await authClient.signOut();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">
          Books<span>App</span>
        </Link>

        <nav className="nav-links">
          <NavLink to="/" end className="nav-link">
            Catálogo
          </NavLink>

          {session && (
            <NavLink to="/books/new" className="nav-link">
              Nuevo libro
            </NavLink>
          )}

          {session && userRole === "admin" && (
            <NavLink to="/admin" className="nav-link">
              Panel Admin
            </NavLink>
          )}
        </nav>

        <div className="nav-user">
          {isPending ? (
            <span className="page-subtitle">Cargando...</span>
          ) : session ? (
            <>
              <div className="user-pill">
                <span>{session.user.name || session.user.email}</span>
                <span
                  className={`role-badge ${userRole === "admin" ? "admin" : ""}`}
                >
                  {userRole}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="btn btn-secondary btn-sm"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Iniciar sesión
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}