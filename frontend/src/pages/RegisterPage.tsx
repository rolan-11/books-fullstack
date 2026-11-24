import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "../lib/auth-client";

const registerSchema = z.object({
  name: z.string().trim().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresá un correo electrónico válido"),
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");

    const { error: authError } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (authError) {
      setServerError(authError.message || "No se pudo crear la cuenta");
      return;
    }

    navigate("/");
  };

  return (
    <div className="container">
      <div className="form-card">
        <h1 style={{ marginBottom: "0.35rem" }}>Crear cuenta</h1>
        <p className="page-subtitle" style={{ marginBottom: "1.5rem" }}>
          Registrate para explorar el catálogo con tu cuenta.
        </p>

        {serverError && <div className="alert alert-error">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input
              id="name"
              type="text"
              placeholder="Tu nombre"
              {...register("name")}
            />
            {errors.name && (
              <p style={{ color: "#f87171", fontSize: "0.82rem", marginTop: "0.3rem" }}>
                {errors.name.message}
              </p>
            )}
          </div>

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
            <label htmlFor="password">Contraseña (mínimo 8 caracteres)</label>
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
            {isSubmitting ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p
          className="page-subtitle"
          style={{ textAlign: "center", marginTop: "1.25rem" }}
        >
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" style={{ color: "var(--accent)" }}>
            Iniciá sesión
          </Link>
        </p>
      </div>
    </div>
  );
}