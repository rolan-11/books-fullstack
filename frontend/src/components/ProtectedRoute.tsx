import type { ReactNode } from "react";
import { Link, Navigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="container">
        <div className="empty-state">Verificando sesión...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const userRole =
    (session.user as { role?: string } | undefined)?.role ?? "user";

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Acceso restringido</h2>
          <p style={{ marginBottom: "1.25rem" }}>
            Esta sección es exclusiva para usuarios con rol{" "}
            <strong>{allowedRoles.join(", ")}</strong>. Tu rol actual es{" "}
            <strong>{userRole}</strong>.
          </p>
          <Link to="/" className="btn btn-primary">
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}