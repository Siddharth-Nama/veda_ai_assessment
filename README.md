# VedaAI Assessment Creator

AI-powered assessment and question paper generator for teachers.

## Architecture

```
├── client/    → Next.js + TypeScript frontend
└── server/    → Express + TypeScript backend
```

## Tech Stack

**Frontend:** Next.js, TypeScript, Zustand, Socket.io-client, jsPDF

**Backend:** Express, TypeScript, MongoDB, Redis, BullMQ, Socket.io, Google Gemini AI

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (Atlas or local)
- Redis (Upstash or local)
- Google Gemini API key

### Server
```bash
cd server
npm install
cp .env.example .env   # fill in your env vars
npm run dev
```

### Client
```bash
cd client
npm install
cp .env.example .env.local   # fill in your env vars
npm run dev
```

## Environment Variables

### Server (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
REDIS_URL=rediss://...
GEMINI_API_KEY=your_key
CLIENT_URL=http://localhost:3000
```

### Client (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=http://localhost:5000
```

## Features
- Assignment creation with file upload, question type configuration
- AI-powered question paper generation using Google Gemini
- Real-time progress updates via WebSocket
- Structured output with sections, difficulty badges, marks
- PDF export with proper formatting
- Background job processing with BullMQ
- Redis caching for performance
