import Redis from "ioredis";
import { env } from "./env";

let redisConnection: Redis | null = null;

export const getRedisConnection = (): Redis => {
  if (!redisConnection) {
    redisConnection = new Redis(env.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      tls: env.redisUrl.startsWith("rediss://") ? {} : undefined,
    });
  }
  return redisConnection;
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
  }
};
