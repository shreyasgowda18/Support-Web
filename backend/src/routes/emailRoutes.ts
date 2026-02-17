import { Router } from "express";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { store } from "../services/store.js";
import { buildReply, categorize, detectSentiment } from "../utils/ai.js";
import { encryptToken } from "../utils/crypto.js";

export const emailRoutes = Router();

emailRoutes.get("/accounts", (_req, res) => {
  res.json(store.emailAccounts);
});

emailRoutes.post("/accounts", (req, res) => {
  const schema = z.object({ address: z.string().email(), oauthRefreshToken: z.string().min(4) });
  const body = schema.parse(req.body);
  const account = {
    id: uuid(),
    address: body.address,
    provider: "gmail" as const,
    encryptedRefreshToken: encryptToken(body.oauthRefreshToken),
    createdAt: new Date().toISOString(),
  };
  store.emailAccounts.push(account);
  res.status(201).json(account);
});

emailRoutes.delete("/accounts/:id", (req, res) => {
  store.emailAccounts = store.emailAccounts.filter((a) => a.id !== req.params.id);
  store.emailThreads = store.emailThreads.filter((t) => t.accountId !== req.params.id);
  res.status(204).send();
});

emailRoutes.get("/threads", (_req, res) => {
  res.json(store.emailThreads);
});

emailRoutes.post("/threads/mock-inbound", (req, res) => {
  const schema = z.object({ accountId: z.string(), sender: z.string().email(), subject: z.string(), message: z.string() });
  const body = schema.parse(req.body);
  const sentiment = detectSentiment(body.message);
  const thread = {
    id: uuid(),
    accountId: body.accountId,
    sender: body.sender,
    subject: body.subject,
    receivedAt: new Date().toISOString(),
    thread: [body.message],
    category: categorize(body.message),
    sentiment,
    priority: sentiment === "angry" ? "high" as const : "normal" as const,
    state: "new" as const,
    internalNotes: [],
  };
  store.emailThreads.push(thread);
  res.status(201).json(thread);
});

emailRoutes.post("/threads/:id/reply-draft", (req, res) => {
  const schema = z.object({ tone: z.enum(["Formal", "Friendly", "Balanced"]).optional() });
  const body = schema.parse(req.body ?? {});
  const thread = store.emailThreads.find((t) => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: "Thread not found" });

  const reply = buildReply({
    body: thread.thread.join("\n"),
    tone: body.tone ?? store.preferences.tone,
    sentiment: thread.sentiment,
    signature: store.preferences.signature,
  });

  res.json({ reply, category: thread.category, sentiment: thread.sentiment });
});

emailRoutes.post("/threads/:id/approve-send", (req, res) => {
  const schema = z.object({ finalReply: z.string().min(2) });
  schema.parse(req.body);
  const thread = store.emailThreads.find((t) => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: "Thread not found" });
  thread.state = "replied";
  res.json(thread);
});

emailRoutes.post("/threads/:id/resolve", (req, res) => {
  const thread = store.emailThreads.find((t) => t.id === req.params.id);
  if (!thread) return res.status(404).json({ error: "Thread not found" });
  thread.state = "resolved";
  res.json(thread);
});
