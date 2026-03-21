import IORedis from "ioredis";
import { env } from "./env";

let redisConnection: IORedis | null = null;

export const getRedisConnection = (): IORedis => {
  if (!redisConnection) {
    const isUpstash = env.redisUrl.includes(".upstash.io");
    redisConnection = new IORedis(env.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      tls: (env.redisUrl.startsWith("rediss://") || isUpstash) ? {} : undefined,
    });
  }
  return redisConnection;
};

export const createNewRedisConnection = (): IORedis => {
  const isUpstash = env.redisUrl.includes(".upstash.io");
  return new IORedis(env.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: (env.redisUrl.startsWith("rediss://") || isUpstash) ? {} : undefined,
  });
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
  }
};
