export interface QuestionConfig {
  id: string;
  type: string;
  count: number;
  marks: number;
}

export interface AssignmentData {
  title: string;
  subject: string;
  classLevel: string;
  section: string;
  dueDate: string;
  questionConfigs: QuestionConfig[];
  additionalInstructions: string;
  fileContent: string;
  fileName: string;
}

export interface GeneratedQuestion {
  questionNumber: number;
  questionText: string;
  difficulty: "easy" | "moderate" | "hard";
  marks: number;
  type: string;
  answer: string;
}

export interface GeneratedSection {
  title: string;
  instruction: string;
  questionType: string;
  marksPerQuestion: number;
  questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
  schoolName: string;
  subject: string;
  classLevel: string;
  timeAllowed: string;
  maxMarks: number;
  generalInstructions: string[];
  sections: GeneratedSection[];
}

export interface AssignmentResponse {
  _id: string;
  title: string;
  subject: string;
  classLevel?: string;
  section?: string;
  dueDate?: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdAt: string;
}
