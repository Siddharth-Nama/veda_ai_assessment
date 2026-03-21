# VedaAI - AI-Powered Assessment Platform
Live Application: https://veda-ai-assessment.vercel.app

Overview
This is my project for the VedaAI assessment. VedaAI is a platform that uses AI to help teachers create professional question papers and assignments. 

I focused on making the UI look exactly like the target designs and ensuring the entire system works reliably. The project handles both desktop and mobile views and uses background workers to generate questions without slowing down the site.

Requirement Fulfillment
I have finished all the requirements for this assignment:

1. UI and Design
- Desktop Layout: The dashboard matches the provided image exactly, including the pill-shaped headers and specific color choices.
- Mobile Layout: Used conditional logic to show a mobile-specific header and bottom navigation on smaller screens.

2. AI Question Generation
- Gemini Integration: Uses Google Gemini to create questions based on the teacher's input.
- Data Format: The AI returns a structured JSON format that includes marks and difficulty levels.

3. Background Processing
- BullMQ and Redis: Long tasks are handled in the background so the user doesn't have to wait on the page.
- Real-time Updates: Uses Socket.io to show a progress bar to the user while the questions are being generated.

4. Backend and Database
- MongoDB: Stores all assignments and generated papers.
- API: includes routes to list, create, and delete assignments.

Tech Stack
- Frontend: Next.js with TypeScript and Vanilla CSS.
- Backend: Express.js with TypeScript.
- AI: Google Gemini API.
- Task Queue: BullMQ and Redis.
- Real-time: Socket.io.
- Database: MongoDB.
- Hosting: Vercel for the frontend and Render for the backend.

Project Structure
- client: Frontend code.
- server: Backend and worker code.
- docs: technical design and API details.

Setup Instructions

Backend Setup
1. Go to the server folder.
2. Run npm install.
3. Set up your .env file.
4. Run npm run build and then npm start.

Frontend Setup
1. Go to the client folder.
2. Run npm install.
3. Set up your .env file.
4. Run npm run dev.

Siddharth Nama
