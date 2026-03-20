import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionConfig {
  type: string;
  count: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  subject: string;
  classLevel: string;
  section: string;
  dueDate: Date;
  questionConfigs: IQuestionConfig[];
  additionalInstructions: string;
  fileContent: string;
  fileName: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
}

const QuestionConfigSchema = new Schema<IQuestionConfig>({
  type: { type: String, required: true },
  count: { type: Number, required: true, min: 1 },
  marks: { type: Number, required: true, min: 1 },
});

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    classLevel: { type: String, required: true, trim: true },
    section: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    questionConfigs: { type: [QuestionConfigSchema], required: true },
    additionalInstructions: { type: String, default: "" },
    fileContent: { type: String, default: "" },
    fileName: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IAssignment>("Assignment", AssignmentSchema);
