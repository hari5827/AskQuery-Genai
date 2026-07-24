import crypto from "crypto";
import redis from "../config/redis.js";

// Builds a short, consistent Redis key out of any number of parts.
// Normalizing (lowercase + trim) means "What is X?" and "what is x?  "
// hit the same cache entry. Hashing keeps the key short regardless of
// how long the question is, and avoids Redis key-syntax issues.
export function buildCacheKey(prefix, parts) {
  const normalized = parts
    .map((p) => String(p ?? "").trim().toLowerCase())
    .join("::");

  const hash = crypto.createHash("sha256").update(normalized).digest("hex");
  return `${prefix}:${hash}`;
}

export async function getCache(key) {
  try {
    const raw = await redis.get(key);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    // Redis being unavailable should never break the actual feature -
    // just treat it as a cache miss and let the normal flow run.
    console.error("Redis get failed:", err.message);
    return null;
  }
}

export async function setCache(key, value, ttlSeconds = 60 * 60 * 24) {
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
  } catch (err) {
    console.error("Redis set failed:", err.message);
  }
}
