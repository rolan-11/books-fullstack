import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message || "Credenciales incorrectas");
      return;
    }

    navigate("/");
  };

  const handleGitHubLogin = async () => {
    setError("");
    const { error: authError } = await authClient.signIn.social({
      provider: "github",
      callbackURL: window.location.origin,
    });

    if (authError) {
      setError(
        authError.message ||
          "GitHub OAuth todavía no está configurado en el servidor"
      );
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h1 style={{ marginBottom: "0.35rem" }}>Iniciar sesión</h1>
        <p className="page-subtitle" style={{ marginBottom: "1.5rem" }}>
          Ingresá para crear o editar libros en el catálogo.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <div className="divider">o</div>

        <button
          type="button"
          onClick={handleGitHubLogin}
          className="btn btn-secondary"
          style={{ width: "100%" }}
        >
          Continuar con GitHub
        </button>

        <p
          className="page-subtitle"
          style={{ textAlign: "center", marginTop: "1.25rem" }}
        >
          ¿No tenés cuenta?{" "}
          <Link to="/register" style={{ color: "var(--accent)" }}>
            Registrate acá
          </Link>
        </p>
      </div>
    </div>
  );
}