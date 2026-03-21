# High-Level Design (HLD)

System Architecture

I used a modern stack to build VedaAI, separating the frontend from the heavy backend processing. 

Architecture Overview:
The system has four main parts:
1. Frontend (Next.js): The site where teachers interact with the dashboard.
2. API Server (Express): Handles requests and talks to the database.
3. Worker (BullMQ): A separate process that handles AI generation tasks.
4. Database and Cache: MongoDB for storage and Redis for queuing.

Component Details

Frontend
The frontend uses Next.js and is where the dashboard is built. It uses the App router and custom CSS to match the design. It also connects to a WebSocket server to get live updates on task progress.

Backend
The backend is an Express server. It provides API endpoints for the frontend to create and manage assignments. Instead of running AI generation directly, it sends those tasks to a queue in Redis.

Worker
The worker is a separate part of the backend. It watches the Redis queue for new jobs. When it finds one, it calls the Gemini AI API, waits for the result, and then saves it to MongoDB. It also sends progress messages back to the user through WebSockets.

Database and Messaging
VedaAI uses MongoDB as the main database for storing all user documents. Redis is used both as a message broker for the worker queue and to help with real-time WebSocket communication.

Data Flow
1. User creates a new assignment on the dashboard.
2. The server saves the initial assignment data and puts a job in the queue.
3. The background worker picks up the job and starts talking to Gemini AI.
4. The worker sends updates like "Processing..." or "80% complete" back to the UI.
5. Once the AI is done, the worker saves the final question paper and marks the assignment as finished.
6. The user's dashboard updates automatically to show the final result.
