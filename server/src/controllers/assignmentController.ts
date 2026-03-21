import { Request, Response, NextFunction } from "express";
import Assignment from "../models/Assignment";
import Result from "../models/Result";
import { addGenerationJob } from "../workers/generationQueue";
import { getRedisConnection } from "../config/redis";

export const createAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      title,
      subject,
      classLevel,
      section,
      dueDate,
      questionConfigs,
      additionalInstructions,
      fileContent,
      fileName,
    } = req.body;

    if (!title || !subject || !classLevel || !dueDate || !questionConfigs?.length) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: title, subject, classLevel, dueDate, questionConfigs",
      });
      return;
    }

    for (const config of questionConfigs) {
      if (!config.type || config.count < 1 || config.marks < 1) {
        res.status(400).json({
          success: false,
          message: "Invalid question config: type required, count and marks must be positive",
        });
        return;
      }
    }

    const assignment = await Assignment.create({
      title,
      subject,
      classLevel,
      section: section || "",
      dueDate: new Date(dueDate),
      questionConfigs,
      additionalInstructions: additionalInstructions || "",
      fileContent: fileContent || "",
      fileName: fileName || "",
      status: "pending",
    });

    await addGenerationJob(assignment._id.toString(), {
      assignmentId: assignment._id.toString(),
      title,
      subject,
      classLevel,
      questionConfigs,
      additionalInstructions: additionalInstructions || "",
      fileContent: fileContent || "",
    });

    await Assignment.findByIdAndUpdate(assignment._id, { status: "processing" });

    res.status(201).json({
      success: true,
      data: {
        assignmentId: assignment._id,
        status: "processing",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      res.status(404).json({ success: false, message: "Assignment not found" });
      return;
    }
    res.json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

export const getAllAssignments = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json({ success: true, data: assignments });
  } catch (error) {
    next(error);
  }
};

export const regenerateAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = String(req.params.id);
    const assignment = await Assignment.findById(id);
    if (!assignment) {
      res.status(404).json({ success: false, message: "Assignment not found" });
      return;
    }

    await Result.deleteMany({ assignmentId: id });
    const redis = getRedisConnection();
    await redis.del(`result:${id}`);

    await Assignment.findByIdAndUpdate(id, { status: "processing" });

    const jobId = `${id}-${Date.now()}`;
    await addGenerationJob(jobId, {
      assignmentId: String(id),
      title: String(assignment.title),
      subject: String(assignment.subject),
      classLevel: String(assignment.classLevel),
      questionConfigs: assignment.questionConfigs.map(q => ({ type: String(q.type), count: Number(q.count), marks: Number(q.marks) })),
      additionalInstructions: String(assignment.additionalInstructions),
      fileContent: String(assignment.fileContent),
    });

    res.json({
      success: true,
      data: { assignmentId: id, status: "processing" },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findByIdAndDelete(id);
    if (!assignment) {
      res.status(404).json({ success: false, message: "Assignment not found" });
      return;
    }
    await Result.deleteMany({ assignmentId: id });
    res.json({ success: true, message: "Assignment deleted successfully" });
  } catch (error) {
    next(error);
  }
};
