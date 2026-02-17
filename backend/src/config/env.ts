import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  encryptionSecret: process.env.ENCRYPTION_SECRET ?? "development-secret-change-me",
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
};
