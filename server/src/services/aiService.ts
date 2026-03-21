import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env";

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

interface QuestionConfig {
  type: string;
  count: number;
  marks: number;
}

interface GenerationInput {
  title: string;
  subject: string;
  classLevel: string;
  questionConfigs: QuestionConfig[];
  additionalInstructions: string;
  fileContent: string;
}

interface GeneratedQuestion {
  questionNumber: number;
  questionText: string;
  difficulty: "easy" | "moderate" | "hard";
  marks: number;
  type: string;
  answer: string;
}

interface GeneratedSection {
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

const buildPrompt = (input: GenerationInput): string => {
  const sectionDetails = input.questionConfigs
    .map((config, index) => {
      const sectionLetter = String.fromCharCode(65 + index);
      return `Section ${sectionLetter}: ${config.count} ${config.type} questions, each worth ${config.marks} marks`;
    })
    .join("\n");

  const totalMarks = input.questionConfigs.reduce(
    (sum, config) => sum + config.count * config.marks,
    0
  );

  let prompt = `Generate a structured question paper for the following:

Subject: ${input.subject}
Class: ${input.classLevel}
Topic: ${input.title}
Total Marks: ${totalMarks}

Sections:
${sectionDetails}

Requirements:
- Each question must have a difficulty level: "easy", "moderate", or "hard"
- Distribute difficulty roughly: 30% easy, 40% moderate, 30% hard
- Each question must have a clear, well-formed question text
- Each question must have a concise answer
- Questions should cover different aspects of the topic
- Make questions appropriate for the class level`;

  if (input.additionalInstructions) {
    prompt += `\n\nAdditional Instructions from teacher:\n${input.additionalInstructions}`;
  }

  if (input.fileContent) {
    prompt += `\n\nReference Content:\n${input.fileContent.substring(0, 3000)}`;
  }

  prompt += `

IMPORTANT: Respond ONLY with valid JSON in this exact format, no markdown or extra text:
{
  "schoolName": "Delhi Public School",
  "subject": "${input.subject}",
  "classLevel": "${input.classLevel}",
  "timeAllowed": "3 Hours",
  "maxMarks": ${totalMarks},
  "generalInstructions": [
    "All questions are compulsory.",
    "Marks are indicated against each question.",
    "Write neat and legible answers."
  ],
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries X marks.",
      "questionType": "MCQ",
      "marksPerQuestion": 1,
      "questions": [
        {
          "questionNumber": 1,
          "questionText": "The question text here",
          "difficulty": "easy",
          "marks": 1,
          "type": "MCQ",
          "answer": "The answer"
        }
      ]
    }
  ]
}`;

  return prompt;
};

const parseResponse = (responseText: string): GeneratedPaper => {
  let cleaned = responseText.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7);
  }
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  const parsed = JSON.parse(cleaned);

  if (!parsed.sections || !Array.isArray(parsed.sections)) {
    throw new Error("Invalid response: missing sections array");
  }

  for (const section of parsed.sections) {
    if (!section.questions || !Array.isArray(section.questions)) {
      throw new Error(`Invalid response: section "${section.title}" missing questions`);
    }
    for (const question of section.questions) {
      if (!["easy", "moderate", "hard"].includes(question.difficulty)) {
        question.difficulty = "moderate";
      }
    }
  }

  return parsed as GeneratedPaper;
};

export const generateQuestionPaper = async (
  input: GenerationInput
): Promise<GeneratedPaper> => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = buildPrompt(input);

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  return parseResponse(text);
};
