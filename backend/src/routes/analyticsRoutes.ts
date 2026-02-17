import { Router } from "express";
import { getAnalytics } from "../services/analytics.js";

export const analyticsRoutes = Router();

analyticsRoutes.get("/", (_req, res) => {
  res.json(getAnalytics());
});
