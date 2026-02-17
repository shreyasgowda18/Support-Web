export type WorkflowState = "new" | "replied" | "resolved";
export type ReviewState = "new" | "replied";

export type Sentiment = "angry" | "neutral" | "happy";
export type EmailCategory = "Bug" | "Complaint" | "Feedback" | "Billing" | "Suggestion" | "Other";

export interface EmailAccount {
  id: string;
  address: string;
  provider: "gmail";
  encryptedRefreshToken: string;
  createdAt: string;
}

export interface EmailThread {
  id: string;
  accountId: string;
  sender: string;
  subject: string;
  receivedAt: string;
  thread: string[];
  category: EmailCategory;
  sentiment: Sentiment;
  state: WorkflowState;
  priority: "high" | "normal";
  internalNotes: string[];
  slaDueAt?: string;
}

export interface AppConnection {
  id: string;
  platform: "play" | "appstore";
  appName: string;
  appId: string;
}

export interface Review {
  id: string;
  appId: string;
  username: string;
  rating: number;
  text: string;
  date: string;
  country?: string;
  sentiment: Sentiment;
  category: EmailCategory;
  state: ReviewState;
}

export interface AIPreference {
  tone: "Formal" | "Friendly" | "Balanced";
  signature: string;
  cannedResponses: string[];
  autoCategorizationRules: string[];
}
