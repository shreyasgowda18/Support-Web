import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { emailRoutes } from "./routes/emailRoutes.js";
import { reviewRoutes } from "./routes/reviewRoutes.js";
import { settingsRoutes } from "./routes/settingsRoutes.js";
import { analyticsRoutes } from "./routes/analyticsRoutes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { requireRole } from "./middleware/rbac.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: ["http://localhost:5173"], credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/emails", requireRole(["admin", "agent"]), emailRoutes);
app.use("/api/reviews", requireRole(["admin", "agent"]), reviewRoutes);
app.use("/api/settings", requireRole(["admin"]), settingsRoutes);
app.use("/api/analytics", requireRole(["admin", "agent"]), analyticsRoutes);

app.use(notFound);
app.use(errorHandler);
