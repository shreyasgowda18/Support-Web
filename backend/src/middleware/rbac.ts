import { Request, Response, NextFunction } from "express";

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req.header("x-role") ?? "agent").toLowerCase();
    if (!roles.includes(role)) {
      return res.status(403).json({ error: "forbidden" });
    }
    next();
  };
}
