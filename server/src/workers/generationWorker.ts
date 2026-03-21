import { Worker, Job } from "bullmq";
import { getRedisConnection } from "../config/redis";
import { generateQuestionPaper } from "../services/aiService";
import { GenerationJobData } from "./generationQueue";
import Assignment from "../models/Assignment";
import Result from "../models/Result";
import { getIO } from "../websocket/socketManager";
import pdf from "pdf-parse";

const processGenerationJob = async (job: Job<GenerationJobData>): Promise<void> => {
  let { assignmentId, title, subject, classLevel, questionConfigs, additionalInstructions, fileContent } = job.data;

  try {
    const io = getIO();
    
    // Handle PDF text extraction
    if (fileContent && fileContent.startsWith("data:application/pdf;base64,")) {
      io.to(assignmentId).emit("generation:progress", {
        assignmentId,
        status: "processing",
        message: "Extracting text from PDF...",
        progress: 5,
      });
      
      const base64Data = fileContent.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");
      const data = await pdf(buffer);
      fileContent = data.text;
    } else if (fileContent && fileContent.startsWith("data:")) {
      // Handle other text-based base64 files
      const base64Data = fileContent.split(",")[1];
      fileContent = Buffer.from(base64Data, "base64").toString("utf-8");
    }

    io.to(assignmentId).emit("generation:progress", {
      assignmentId,
      status: "processing",
      message: "Generating question paper...",
      progress: 10,
    });

    const paper = await generateQuestionPaper({
      title,
      subject,
      classLevel,
      questionConfigs,
      additionalInstructions,
      fileContent,
    });

    io.to(assignmentId).emit("generation:progress", {
      assignmentId,
      status: "processing",
      message: "Saving results...",
      progress: 80,
    });

    await Result.deleteMany({ assignmentId });

    await Result.create({
      assignmentId,
      schoolName: paper.schoolName,
      subject: paper.subject,
      classLevel: paper.classLevel,
      timeAllowed: paper.timeAllowed,
      maxMarks: paper.maxMarks,
      generalInstructions: paper.generalInstructions,
      sections: paper.sections,
    });

    await Assignment.findByIdAndUpdate(assignmentId, { status: "completed" });

    const redis = getRedisConnection();
    await redis.del(`result:${assignmentId}`);

    io.to(assignmentId).emit("generation:complete", {
      assignmentId,
      status: "completed",
      message: "Question paper generated successfully!",
      progress: 100,
    });
  } catch (error) {
    await Assignment.findByIdAndUpdate(assignmentId, { status: "failed" });

    try {
      const io = getIO();
      io.to(assignmentId).emit("generation:error", {
        assignmentId,
        status: "failed",
        message: error instanceof Error ? error.message : "Generation failed",
      });
    } catch (_) {}

    throw error;
  }
};

export const startWorker = (): Worker => {
  const worker = new Worker("question-generation", processGenerationJob, {
    connection: getRedisConnection(),
    concurrency: 2,
    limiter: {
      max: 5,
      duration: 60000,
    },
  });

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
  });

  return worker;
};
