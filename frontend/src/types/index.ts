export type Tone = "Formal" | "Friendly" | "Balanced";

export interface EmailAccount {
  id: string;
  address: string;
}

export interface EmailThread {
  id: string;
  accountId: string;
  sender: string;
  subject: string;
  receivedAt: string;
  thread: string[];
  category: string;
  sentiment: string;
  state: "new" | "replied" | "resolved";
  priority: "high" | "normal";
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
  sentiment: string;
  category: string;
  state: "new" | "replied";
}
