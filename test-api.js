const http = require('http');

const data = JSON.stringify({
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
  fileName: ""
});

const req = http.request(
  {
    hostname: 'localhost',
    port: 5000,
    path: '/api/assignments',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  },
  (res) => {
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    res.on('end', () => {
      console.log(responseData);
    });
  }
);

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
