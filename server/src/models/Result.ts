import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion {
  questionNumber: number;
  questionText: string;
  difficulty: "easy" | "moderate" | "hard";
  marks: number;
  type: string;
  answer: string;
}

export interface ISection {
  title: string;
  instruction: string;
  questionType: string;
  marksPerQuestion: number;
  questions: IQuestion[];
}

export interface IResult extends Document {
  assignmentId: mongoose.Types.ObjectId;
  schoolName: string;
  subject: string;
  classLevel: string;
  timeAllowed: string;
  maxMarks: number;
  generalInstructions: string[];
  sections: ISection[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  questionNumber: { type: Number, required: true },
  questionText: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["easy", "moderate", "hard"],
    required: true,
  },
  marks: { type: Number, required: true },
  type: { type: String, required: true },
  answer: { type: String, default: "" },
});

const SectionSchema = new Schema<ISection>({
  title: { type: String, required: true },
  instruction: { type: String, required: true },
  questionType: { type: String, required: true },
  marksPerQuestion: { type: Number, required: true },
  questions: { type: [QuestionSchema], required: true },
});

const ResultSchema = new Schema<IResult>(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },
    schoolName: { type: String, default: "Delhi Public School" },
    subject: { type: String, required: true },
    classLevel: { type: String, required: true },
    timeAllowed: { type: String, default: "3 Hours" },
    maxMarks: { type: Number, required: true },
    generalInstructions: { type: [String], default: [] },
    sections: { type: [SectionSchema], required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IResult>("Result", ResultSchema);
