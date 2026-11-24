import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "../lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Ingresá un correo electrónico válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");

    const { error: authError } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setServerError(authError.message || "Credenciales incorrectas");
      return;
    }

    navigate("/");
  };

  const handleGitHubLogin = async () => {
    setServerError("");
    const { error: authError } = await authClient.signIn.social({
      provider: "github",
      callbackURL: window.location.origin,
    });

    if (authError) {
      setServerError(
        authError.message || "No se pudo iniciar sesión con GitHub"
      );
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h1 style={{ marginBottom: "0.35rem" }}>Iniciar sesión</h1>
        <p className="page-subtitle" style={{ marginBottom: "1.5rem" }}>
          Ingresá con tu cuenta para acceder a la plataforma.
        </p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              {...register("email")}
            />
            {errors.email && (
              <p style={{ color: "#f87171", fontSize: "0.82rem", marginTop: "0.3rem" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p style={{ color: "#f87171", fontSize: "0.82rem", marginTop: "0.3rem" }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            {isSubmitting ? "Ingresando..." : "Entrar"}
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