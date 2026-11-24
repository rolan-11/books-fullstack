import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;

declare global {
  namespace Express {
    interface Request {
      session?: NonNullable<AuthSession>["session"];
      user?: NonNullable<AuthSession>["user"];
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sessionData = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!sessionData) {
      res.status(401).json({ message: "No autorizado. Iniciá sesión primero." });
      return;
    }

    req.session = sessionData.session;
    req.user = sessionData.user;
    next();
  } catch (error) {
    res.status(500).json({ message: "Error al verificar la sesión", error });
  }
};

export const requireRole =
  (...allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.user?.role ?? "user";

    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        message: "No tenés permisos suficientes para realizar esta acción.",
      });
      return;
    }

    next();
  };