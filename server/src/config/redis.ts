import IORedis from "ioredis";
import { env } from "./env";

let redisConnection: IORedis | null = null;

export const getRedisConnection = (): IORedis => {
  if (!redisConnection) {
    redisConnection = new IORedis(env.redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      tls: env.redisUrl.startsWith("rediss://") ? {} : undefined,
    });
  }
  return redisConnection;
};

export const createNewRedisConnection = (): IORedis => {
  return new IORedis(env.redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: env.redisUrl.startsWith("rediss://") ? {} : undefined,
  });
};

export const closeRedisConnection = async (): Promise<void> => {
  if (redisConnection) {
    await redisConnection.quit();
    redisConnection = null;
  }
};
