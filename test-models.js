const apiKey = "AIzaSyCDwCUeKt9_9cl0HCRsm5L5mRkX-5Pyo8o"; // New key provided by user

async function run() {
  console.log('Testing raw Gemini API with key...', apiKey.substring(0, 5) + '...');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));
    console.log("MODELS:", data.models.map(m => m.name));
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
run();
