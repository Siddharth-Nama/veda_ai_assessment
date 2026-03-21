const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI("AIzaSyCDwCUeKt9_9cl0HCRsm5L5mRkX-5Pyo8o");

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent("Hello!");
    const response = result.response;
    console.log("SUCCESS:", response.text());
  } catch (err) {
    console.error("SDK ERROR:", err);
  }
}
run();
