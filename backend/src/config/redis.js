import Redis from "ioredis";

// REDIS_URL example: redis://localhost:6379 (local) or the connection
// string your provider (Upstash, Redis Cloud, etc.) gives you.
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

export default redis;
