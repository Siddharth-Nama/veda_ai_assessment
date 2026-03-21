const apiKey = "AIzaSyCDwCUeKt9_9cl0HCRsm5L5mRkX-5Pyo8o"; // New key provided by user

async function run() {
  console.log('Testing raw Gemini API with key...', apiKey.substring(0, 5) + '...');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: "Hello! This is a test." }]
          }]
        })
      }
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    console.log("REPLY:", data.candidates[0].content.parts[0].text);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
run();
