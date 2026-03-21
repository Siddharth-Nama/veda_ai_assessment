# Low-Level Design (LLD)

Project Structure

I organized the codebase into clear modules for the frontend and backend. 

Database Models (ERD)

VedaAI uses two main collections in MongoDB.

```mermaid
erDiagram
    ASSIGNMENT {
        string title
        string subject
        string classLevel
        date dueDate
        string status
        object[] questionConfigs
    }
    RESULT {
        string assignmentId
        string schoolName
        string timeAllowed
        number maxMarks
        object[] sections
    }
    ASSIGNMENT ||--o| RESULT : "generates"
```

Sequence Diagram

The following diagram shows the end-to-end signal flow when a new assignment is created.

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant API
    participant Redis
    participant Worker
    participant Gemini
    participant Socket

    User->>Dashboard: Fill form and click Create
    Dashboard->>API: POST /api/assignments
    API->>Redis: Enqueue generation job
    API-->>Dashboard: 201 Created (Pending)
    
    Worker->>Redis: Pick job from queue
    Worker-->>Socket: Update progress (10%)
    Socket-->>Dashboard: Show progress bar
    
    Worker->>Gemini: Send prompt with instructions
    Gemini-->>Worker: Return structured JSON
    
    Worker->>MongoDB: Save result document
    Worker-->>Socket: Update progress (100%)
    Socket-->>Dashboard: Mark as Complete
    Dashboard->>User: Show "View Results" button
```

Component Logic

1. Dashboard (Dashboard/page.tsx)
The dashboard uses a mounting guard (`mounted` state) to ensure that the initial HTML from the server matches the first render in the browser. This prevents hydration errors caused by browser extensions.

2. Assignment Form (AssignmentForm.tsx)
The form uses Zustand to keep track of the assignment state globally. It calculates the total marks and question count automatically as the user adjusts the stepper values. 

3. Result Display (ResultDisplay.tsx)
This component connects to the WebSocket server once the assignment ID is known. It listens for `generation:progress` events to update the UI feedback. It also includes the print-specific CSS required for the "Download PDF" functionality.

4. AI Service (aiService.ts)
This is where the prompt engineering happens. I built a prompt that forces Gemini to return a clean JSON object. The service also includes a parser that removes any AI-generated markdown tags before the data is saved to the database.
