import { Queue } from "bullmq";
import { getRedisConnection } from "../config/redis";

let generationQueue: Queue | null = null;

export const getGenerationQueue = (): Queue => {
  if (!generationQueue) {
    generationQueue = new Queue("question-generation", {
      connection: getRedisConnection(),
    });
  }
  return generationQueue;
};

export interface GenerationJobData {
  assignmentId: string;
  title: string;
  subject: string;
  classLevel: string;
  questionConfigs: { type: string; count: number; marks: number }[];
  additionalInstructions: string;
  fileContent: string;
}

export const addGenerationJob = async (
  jobId: string,
  data: GenerationJobData
): Promise<void> => {
  const queue = getGenerationQueue();
  await queue.add("generate", data, {
    jobId,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  });
};
