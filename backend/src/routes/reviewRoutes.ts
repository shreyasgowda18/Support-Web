import { Router } from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { store } from "../services/store.js";
import { buildReply, categorize, detectSentiment } from "../utils/ai.js";

export const reviewRoutes = Router();

reviewRoutes.get("/apps", (_req, res) => {
  res.json(store.apps);
});

reviewRoutes.post("/apps", (req, res) => {
  const schema = z.object({ platform: z.enum(["play", "appstore"]), appName: z.string(), appId: z.string() });
  const app = { id: uuid(), ...schema.parse(req.body) };
  store.apps.push(app);
  res.status(201).json(app);
});

reviewRoutes.delete("/apps/:id", (req, res) => {
  store.apps = store.apps.filter((app) => app.id !== req.params.id);
  store.reviews = store.reviews.filter((r) => r.appId !== req.params.id);
  res.status(204).send();
});

reviewRoutes.get("/items", (_req, res) => {
  res.json(store.reviews);
});

reviewRoutes.post("/items/mock-inbound", (req, res) => {
  const schema = z.object({ appId: z.string(), username: z.string(), rating: z.number().min(1).max(5), text: z.string(), country: z.string().optional() });
  const body = schema.parse(req.body);
  const review = {
    id: uuid(),
    appId: body.appId,
    username: body.username,
    rating: body.rating,
    text: body.text,
    date: new Date().toISOString(),
    country: body.country,
    sentiment: detectSentiment(body.text),
    category: categorize(body.text),
    state: "new" as const,
  };
  store.reviews.push(review);
  res.status(201).json(review);
});

reviewRoutes.post("/items/:id/reply-draft", (req, res) => {
  const schema = z.object({ tone: z.enum(["Formal", "Friendly", "Balanced"]).optional() });
  const body = schema.parse(req.body ?? {});
  const review = store.reviews.find((r) => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: "Review not found" });

  const reply = buildReply({
    body: review.text,
    rating: review.rating,
    tone: body.tone ?? store.preferences.tone,
    sentiment: review.sentiment,
    signature: store.preferences.signature,
  });

  // Typical store limit guard
  const limitedReply = reply.slice(0, 350);
  res.json({ reply: limitedReply, sentiment: review.sentiment, category: review.category });
});

reviewRoutes.post("/items/:id/approve-post", (req, res) => {
  const schema = z.object({ finalReply: z.string().min(2) });
  schema.parse(req.body);
  const review = store.reviews.find((r) => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: "Review not found" });
  review.state = "replied";
  res.json(review);
});
