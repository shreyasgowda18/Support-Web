import crypto from "node:crypto";
import { env } from "../config/env.js";

const IV_LENGTH = 16;

export function encryptToken(value: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.scryptSync(env.encryptionSecret, "support-web-salt", 32);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptToken(payload: string): string {
  const [ivHex, encryptedHex] = payload.split(":");
  const key = crypto.scryptSync(env.encryptionSecret, "support-web-salt", 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, Buffer.from(ivHex, "hex"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]);
  return decrypted.toString("utf8");
}
