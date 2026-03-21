# VedaAI - AI-Powered Assessment Platform
[Live Application: Click Here to Open App](https://veda-ai-assessment.vercel.app)

## Overview
Welcome to my submission for the VedaAI Assessment. I have engineered **VedaAI**, a high-performance AI-driven assessment platform that transforms curriculum requirements into structured, professional question papers.

This project is a pixel-perfect, full-stack AI platform. It integrates a refined React dashboard, multi-modal AI processing (Google Gemini), and a distributed task queue (BullMQ/Redis) to ensure reliable content generation. I built this to not just meet, but exceed the assignment requirements, focusing on **Exact UI Replication**, **Architectural Purity**, and **Real-time Feedback**.

## ✅ Requirement Satisfaction Matrix
I have rigorously implemented 100% of the assignment requirements:

1. **Exact UI Replication**
   - **Desktop**: Pixel-perfect matching of the provided dashboard design (Image 2) with pill-shaped headers, refined typography, and exact color palettes.
   - **Mobile**: Fully responsive mobile interface (Image 3) featuring conditional rendering (if/else logic) for headers and navigation.

2. **AI-Powered Question Generation**
   - **LLM Integration**: Utilizes Google Gemini to generate high-quality questions based on subject, title, and teacher instructions.
   - **Structured Output**: AI generates valid JSON containing sections, difficulty levels, and marking schemes.

3. **Distributed Execution Engine**
   - **Asynchronous Processing**: Every generation job runs as an isolated worker task via BullMQ and Redis, keeping the UI non-blocking.
   - **Real-time WebSockets**: Integrated Socket.io to provide live progress bars (0-100%) as the AI thinks and saves data.

4. **Data Persistence & Management**
   - **Database**: MongoDB (via Mongoose) stores all assignments, results, and processing statuses.
   - **History**: A professional dashboard allows users to view, manage, and delete previous assignments.

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router) with TypeScript & Vanilla CSS.
- **Backend**: Express.js with TypeScript.
- **Content Engine**: Google Gemini AI API.
- **Task Queue**: BullMQ & Redis (ioredis).
- **Real-time**: Socket.io (WebSockets).
- **Database**: MongoDB (Mongoose).
- **Deployment**: Vercel (Frontend) & Render (Backend/Docker).

## 📂 Project Structure
- **/client**: Next.js frontend with exact UI replicas.
- **/server**: Express backend with BullMQ workers and AI services.
- **/docs**: Detailed technical documentation (HLD, LLD, API).

## 🚀 Setup Instructions

### Pre-requisites
- Node.js v18+
- MongoDB & Redis (or Upstash/Atlas for cloud)
- Gemini API Key

### Backend Setup
```bash
cd server
npm install
# Configure .env based on .env.example
npm run build
npm start
```

### Frontend Setup
```bash
cd client
npm install
# Configure .env based on .env.example
npm run dev
```

© 2026 Developed by Siddharth Nama
