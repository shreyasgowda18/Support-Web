import { v4 as uuid } from "uuid";
import { AppConnection, AIPreference, EmailAccount, EmailThread, Review } from "../types/domain.js";
import { categorize, detectSentiment } from "../utils/ai.js";

class InMemoryStore {
  emailAccounts: EmailAccount[] = [];
  emailThreads: EmailThread[] = [];
  apps: AppConnection[] = [];
  reviews: Review[] = [];
  preferences: AIPreference = {
    tone: "Balanced",
    signature: "Best regards,\nSupport Team",
    cannedResponses: [],
    autoCategorizationRules: [],
  };

  seed() {
    if (this.emailThreads.length > 0) return;
    const accountId = uuid();
    this.emailAccounts.push({
      id: accountId,
      address: "support@game1.com",
      provider: "gmail",
      encryptedRefreshToken: "demo",
      createdAt: new Date().toISOString(),
    });

    const sampleMessage = "Your latest update crashes on launch and I need a refund.";
    this.emailThreads.push({
      id: uuid(),
      accountId,
      sender: "player1@email.com",
      subject: "App crash after update",
      receivedAt: new Date().toISOString(),
      thread: [sampleMessage],
      category: categorize(sampleMessage),
      sentiment: detectSentiment(sampleMessage),
      state: "new",
      priority: "high",
      internalNotes: [],
      slaDueAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    });

    const appId = uuid();
    this.apps.push({ id: appId, platform: "play", appName: "Game One", appId: "com.company.game1" });
    this.reviews.push({
      id: uuid(),
      appId,
      username: "playerReview",
      rating: 2,
      text: "Game keeps freezing on level 3",
      date: new Date().toISOString(),
      country: "US",
      sentiment: detectSentiment("Game keeps freezing on level 3"),
      category: categorize("Game keeps freezing on level 3"),
      state: "new",
    });
  }
}

export const store = new InMemoryStore();
