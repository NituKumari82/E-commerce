import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// Make Redis optional - skip if URL not configured
export const redis = process.env.UPSTASH_REDIS_URL 
	? new Redis(process.env.UPSTASH_REDIS_URL, {
			enableAutoPipelining: true,
			retryStrategy(times) {
				return Math.min(times * 100, 3000);
			},
		})
	: null;

if (redis) {
	redis.on("connect", () => {
		console.log("✓ Redis connected successfully");
	});

	redis.on("error", (err) => {
		console.error("⚠ Redis connection error (non-blocking):", err.message);
	});

	redis.on("reconnecting", () => {
		console.log("↻ Redis reconnecting...");
	});

	redis.ping()
		.then(() => console.log("✓ Redis ping OK"))
		.catch((err) => console.error("⚠ Redis ping failed:", err.message));
} else {
	console.log("⚠ Redis not configured - app will run without caching");
}
