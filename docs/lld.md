# Low-Level Design (LLD) - VedaAI

## 🗄️ Database Schemas (Mongoose)

### 1. Assignment Model
- `title`: String (Required)
- `subject`: String (Required)
- `classLevel`: String (Required)
- `section`: String
- `dueDate`: Date (Required)
- `questionConfigs`: Array of objects (Type, Count, Marks)
- `additionalInstructions`: String
- `status`: Enum ("pending", "processing", "completed", "failed")
- `createdAt`: Date (Auto)

### 2. Result Model
- `assignmentId`: ObjectId (Reference)
- `schoolName`: String
- `subject`: String
- `classLevel`: String
- `timeAllowed`: String
- `maxMarks`: Number
- `generalInstructions`: Array of Strings
- `sections`: Array of Section Objects
  - `title`, `instruction`, `questionType`, `marksPerQuestion`
  - `questions`: Array of Question Objects (Text, Answer, Difficulty, Marks)

## 📡 WebSocket Event Protocol

VedaAI uses Socket.io for real-time generation feedback:

| Event Name | Direction | Payload |
| :--- | :--- | :--- |
| `join` | UI -> Server | `{ assignmentId }` |
| `generation:progress` | Server -> UI | `{ progress, message, status }` |
| `generation:complete`| Server -> UI | `{ assignmentId, status }` |
| `generation:error`| Server -> UI | `{ message, status }` |

## 🤖 AI Service Orchestration

### Prompt Strategy
The `aiService.ts` builds a highly structured prompt for Gemini:
1. **Context**: Defines the subject, class, and topic as the core context.
2. **Constraints**: Injects the teacher's additional instructions and reference file content.
3. **Format Enforcement**: Explicitly requests a JSON response matching the VedaAI schema, preventing markdown formatting.
4. **Difficulty Balancing**: Instructs the AI to maintain a 30/40/30 distribution across Easy, Moderate, and Hard questions.

### Post-Processing
- **JSON Cleanup**: Handles common AI output issues like markdown code blocks (```json).
- **Validation**: Ensures the output JSON has the required `sections` and `questions` arrays before saving to DB.

## 📱 Client-Side Rendering Logic

### AppShell Conditional Pattern
To ensure "Exact UI" while maintaining hydration safety:
1. **Mounted State**: Prevents `isMobile` checks during the first server-rendered pass.
2. **suppressHydrationWarning**: Applied at the body level to handle extension-added attributes (e.g., HIX).
3. **AppShell Logic**:
   ```typescript
   if (isMobile) {
     return <MobileHeader /> + <children> + <BottomNav />;
   } else {
     return <Sidebar /> + <TopHeader /> + <children>;
   }
   ```
