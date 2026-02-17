import { EmailCategory, Sentiment } from "../types/domain.js";

const angryKeywords = ["refund", "hate", "broken", "terrible", "angry", "fraud"];

export function detectSentiment(input: string): Sentiment {
  const text = input.toLowerCase();
  if (angryKeywords.some((w) => text.includes(w))) return "angry";
  if (["love", "thanks", "great", "awesome"].some((w) => text.includes(w))) return "happy";
  return "neutral";
}

export function categorize(input: string): EmailCategory {
  const text = input.toLowerCase();
  if (text.includes("crash") || text.includes("bug")) return "Bug";
  if (text.includes("bill") || text.includes("payment") || text.includes("refund")) return "Billing";
  if (text.includes("feature") || text.includes("suggest")) return "Suggestion";
  if (text.includes("complain") || text.includes("bad")) return "Complaint";
  if (text.includes("feedback")) return "Feedback";
  return "Other";
}

export function buildReply(params: {
  body: string;
  tone: "Formal" | "Friendly" | "Balanced";
  sentiment: Sentiment;
  rating?: number;
  signature?: string;
}): string {
  const prefix = params.rating
    ? params.rating <= 2
      ? "We're truly sorry for your experience."
      : params.rating === 3
      ? "Thank you for sharing a balanced perspective."
      : "Thank you so much for your positive review!"
    : params.sentiment === "angry"
    ? "I'm sorry for the frustration this caused."
    : "Thank you for reaching out.";

  const toneLine =
    params.tone === "Formal"
      ? "We appreciate your patience while we investigate this thoroughly."
      : params.tone === "Friendly"
      ? "We really appreciate you bringing this up, and we're on it."
      : "Thanks for reporting this. We're actively reviewing it now.";

  const core = params.body.slice(0, 240);
  return `${prefix}\n${toneLine}\nRegarding your message: "${core}"\nWe'll follow up with updates shortly.${params.signature ? `\n\n${params.signature}` : ""}`;
}
