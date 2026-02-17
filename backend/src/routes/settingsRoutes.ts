import { Router } from "express";
import { z } from "zod";
import { store } from "../services/store.js";

export const settingsRoutes = Router();

settingsRoutes.get("/preferences", (_req, res) => {
  res.json(store.preferences);
});

settingsRoutes.put("/preferences", (req, res) => {
  const schema = z.object({
    tone: z.enum(["Formal", "Friendly", "Balanced"]),
    signature: z.string(),
    cannedResponses: z.array(z.string()),
    autoCategorizationRules: z.array(z.string()),
  });

  store.preferences = schema.parse(req.body);
  res.json(store.preferences);
});
