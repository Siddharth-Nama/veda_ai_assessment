require('dotenv').config({ path: 'server/.env' });
const { generateQuestionPaper } = require('./server/src/services/aiService');

const assignmentData = {
  title: "Algebra Mastery",
  subject: "Mathematics",
  classLevel: "10",
  section: "A",
  dueDate: "2026-12-01",
  questionConfigs: [
    { id: "1", type: "MCQ", count: 2, marks: 1 },
    { id: "2", type: "Short Answer", count: 1, marks: 3 }
  ],
  additionalInstructions: "Make the questions challenging.",
  fileContent: "",
};

async function testGeneration() {
  console.log('Testing Gemini Generation...', process.env.GEMINI_API_KEY.substring(0, 10));
  try {
    const result = await generateQuestionPaper(assignmentData);
    console.log('GENERATION SUCCESS:', JSON.stringify(result).substring(0, 200) + '...');
  } catch (err) {
    console.error('GENERATION FAILED:', err);
  }
}

testGeneration();
