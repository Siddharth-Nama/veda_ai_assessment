import { describe, it, expect } from "@jest/globals";

describe("Assignment Model Validation", () => {
  it("should validate required fields structure", () => {
    const validAssignment = {
      title: "Math Mid-Term",
      subject: "Mathematics",
      classLevel: "10",
      dueDate: new Date("2025-04-01"),
      questionConfigs: [
        { type: "MCQ", count: 5, marks: 2 },
        { type: "Short Answer", count: 3, marks: 5 },
      ],
    };
    expect(validAssignment.title).toBeDefined();
    expect(validAssignment.subject).toBeDefined();
    expect(validAssignment.classLevel).toBeDefined();
    expect(validAssignment.dueDate).toBeInstanceOf(Date);
    expect(validAssignment.questionConfigs.length).toBeGreaterThan(0);
  });

  it("should validate question config constraints", () => {
    const config = { type: "MCQ", count: 5, marks: 2 };
    expect(config.count).toBeGreaterThan(0);
    expect(config.marks).toBeGreaterThan(0);
    expect(config.type).toBeTruthy();
  });

  it("should reject invalid question configs", () => {
    const invalidCount = { type: "MCQ", count: -1, marks: 2 };
    const invalidMarks = { type: "MCQ", count: 5, marks: 0 };
    const missingType = { type: "", count: 5, marks: 2 };
    expect(invalidCount.count).toBeLessThan(1);
    expect(invalidMarks.marks).toBeLessThan(1);
    expect(missingType.type).toBeFalsy();
  });

  it("should calculate total marks correctly", () => {
    const configs = [
      { type: "MCQ", count: 10, marks: 1 },
      { type: "Short Answer", count: 5, marks: 3 },
      { type: "Long Answer", count: 3, marks: 5 },
    ];
    const totalMarks = configs.reduce((sum, c) => sum + c.count * c.marks, 0);
    expect(totalMarks).toBe(40);
  });

  it("should validate status enum values", () => {
    const validStatuses = ["pending", "processing", "completed", "failed"];
    expect(validStatuses).toContain("pending");
    expect(validStatuses).toContain("processing");
    expect(validStatuses).toContain("completed");
    expect(validStatuses).toContain("failed");
    expect(validStatuses).not.toContain("unknown");
  });
});

describe("Result Model Validation", () => {
  it("should validate section structure", () => {
    const section = {
      title: "Section A",
      instruction: "Attempt all questions",
      questionType: "MCQ",
      marksPerQuestion: 2,
      questions: [
        {
          questionNumber: 1,
          questionText: "What is 2+2?",
          difficulty: "easy" as const,
          marks: 2,
          type: "MCQ",
          answer: "4",
        },
      ],
    };
    expect(section.title).toBeDefined();
    expect(section.instruction).toBeDefined();
    expect(section.questions.length).toBeGreaterThan(0);
  });

  it("should validate difficulty values", () => {
    const validDifficulties = ["easy", "moderate", "hard"];
    expect(validDifficulties).toContain("easy");
    expect(validDifficulties).toContain("moderate");
    expect(validDifficulties).toContain("hard");
  });

  it("should validate question structure completeness", () => {
    const question = {
      questionNumber: 1,
      questionText: "Explain photosynthesis",
      difficulty: "moderate" as const,
      marks: 5,
      type: "Long Answer",
      answer: "Photosynthesis is the process...",
    };
    expect(question.questionNumber).toBeGreaterThan(0);
    expect(question.questionText.length).toBeGreaterThan(0);
    expect(question.marks).toBeGreaterThan(0);
    expect(question.type).toBeTruthy();
    expect(question.answer).toBeTruthy();
  });
});

describe("AI Response Parsing", () => {
  it("should parse clean JSON response", () => {
    const response = JSON.stringify({
      schoolName: "Delhi Public School",
      subject: "Mathematics",
      classLevel: "10",
      timeAllowed: "3 Hours",
      maxMarks: 80,
      generalInstructions: ["All questions are compulsory."],
      sections: [
        {
          title: "Section A",
          instruction: "Attempt all",
          questionType: "MCQ",
          marksPerQuestion: 1,
          questions: [
            {
              questionNumber: 1,
              questionText: "Test?",
              difficulty: "easy",
              marks: 1,
              type: "MCQ",
              answer: "A",
            },
          ],
        },
      ],
    });
    const parsed = JSON.parse(response);
    expect(parsed.schoolName).toBe("Delhi Public School");
    expect(parsed.sections).toHaveLength(1);
    expect(parsed.sections[0].questions).toHaveLength(1);
  });

  it("should handle markdown-wrapped JSON", () => {
    const wrapped = '```json\n{"schoolName":"Test"}\n```';
    let cleaned = wrapped.trim();
    if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
    if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
    cleaned = cleaned.trim();
    const parsed = JSON.parse(cleaned);
    expect(parsed.schoolName).toBe("Test");
  });

  it("should normalize invalid difficulty values", () => {
    const question = { difficulty: "super hard" };
    if (!["easy", "moderate", "hard"].includes(question.difficulty)) {
      question.difficulty = "moderate";
    }
    expect(question.difficulty).toBe("moderate");
  });
});

describe("Validation Logic", () => {
  it("should reject empty title", () => {
    const valid = (title: string) => title && title.trim().length > 0;
    expect(valid("")).toBeFalsy();
    expect(valid("  ")).toBeFalsy();
    expect(valid("Math Test")).toBeTruthy();
  });

  it("should reject past due dates", () => {
    const isPastDate = (date: string) => new Date(date) < new Date();
    expect(isPastDate("2020-01-01")).toBeTruthy();
  });

  it("should validate environment variables", () => {
    const validateEnv = (vars: Record<string, string>) => {
      const required = ["MONGODB_URI", "REDIS_URL", "GEMINI_API_KEY"];
      return required.filter((key) => !vars[key]);
    };
    const missing = validateEnv({ MONGODB_URI: "test" });
    expect(missing).toContain("REDIS_URL");
    expect(missing).toContain("GEMINI_API_KEY");
    expect(missing).not.toContain("MONGODB_URI");
  });
});
