import { Request, Response, NextFunction } from "express";
import Result from "../models/Result";
import { getRedisConnection } from "../config/redis";

const CACHE_TTL = 300;

export const getResultByAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { assignmentId } = req.params;
    const redis = getRedisConnection();
    const cacheKey = `result:${assignmentId}`;

    const cached = await redis.get(cacheKey);
    if (cached) {
      res.json({ success: true, data: JSON.parse(cached), cached: true });
      return;
    }

    const result = await Result.findOne({ assignmentId });
    if (!result) {
      res.json({ success: false, message: "Result not yet generated" });
      return;
    }

    await redis.set(cacheKey, JSON.stringify(result), "EX", CACHE_TTL);
    res.json({ success: true, data: result, cached: false });
  } catch (error) {
    next(error);
  }
};
