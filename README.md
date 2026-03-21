# VedaAI Assessment Creator

A full-stack, AI-powered application that allows teachers to rapidly create structured question papers. Built specifically for the VedaAI Full Stack Engineering Assignment.

## Live Demo
*Will be provided via Vercel / Render deployment links.*

---

## 🏗️ Architecture Overview

The system follows a typical modern stack separated into a frontend client and backend service, communicating via REST APIs and WebSockets.

### 1. Frontend (Next.js + TypeScript)
- **Framework:** Next.js (App Router)
- **State Management:** Zustand (lightweight, perfect for form state)
- **Styling:** Custom CSS with CSS Variables (matching the provided Figma design)
- **Real-time:** Socket.io-client for watching AI generation progress
- **PDF Export:** Browser-native print-to-PDF optimized via CSS (for perfect visual layout) + basic jsPDF fallback.

### 2. Backend (Node.js + Express + TypeScript)
- **API Engine:** Express.js
- **Database:** MongoDB (using Mongoose for schemas: `Assignment` and `Result`)
- **Job Queue:** BullMQ + Redis (handles background processing of AI requests)
- **AI Integration:** Google Gemini API (`gemini-1.5-flash` model for fast, structured JSON output)
- **Real-time Engine:** Socket.io server to push progress percentage to the client.

---

## 🚀 Key Features

1. **Intelligent Assignment Creation**
   - Configure multiple sections of questions (MCQ, Short, Long, Numerical)
   - Dynamic steppers for count and marks
   - Drag-and-drop file upload placeholder

2. **AI-Powered Generation Queue**
   - The user doesn't wait for a slow HTTP request to timeout.
   - Request goes to a BullMQ queue backed by Redis (Upstash).
   - A background worker processes the job using Gemini AI, ensuring reliability.

3. **Real-Time WebSocket Progress**
   - While the AI generates the paper, the frontend shows a live loading spinner and progress bar.
   - Receives events: `processing`, `completed`, `failed`.

4. **Beautiful, Structured Output**
   - Clean, exam-style UI formatting mimicking the Figma design.
   - Difficulty Badges (Easy/Moderate/Challenging) and Marks tags.
   - Dedicated "Answer Key" section auto-generated at the bottom.
   - **Regenerate Action:** Clears old results and re-queues the generation with one click.

---

## 🛠️ Local Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)
- Redis instance (local or Upstash)
- Google Gemini API Key

### 1. Server Setup
```bash
cd server
npm install

# Create .env based on .env.example
# Add your MONGODB_URI, REDIS_URL, and GEMINI_API_KEY
cp .env.example .env

# Start dev server
npm run dev
```
The server will run on `http://localhost:5000`.

### 2. Client Setup
```bash
cd client
npm install

# Create .env.local
cp .env.example .env.local

# Start dev server
npm run dev
```
The client will run on `http://localhost:3000`.

---

## 🧪 Testing

The backend includes a suite of Jest unit tests covering:
- Mongoose model validation rules
- AI Response JSON parsing logic
- Environmental variable validation

To run tests:
```bash
cd server
npm test
```

---

## 👨‍💻 Development Flow & Commits
This repository was built with over 30 isolated atomic commits, documenting the exact step-by-step approach taken from repository initialization to final polish.

No comments exist in the final codebase, adhering strictly to clean code practices.
