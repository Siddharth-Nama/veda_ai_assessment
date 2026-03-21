# API Documentation

The VedaAI backend uses a RESTful API at the /api prefix.

Assignments API

Get all assignments
- Method: GET /assignments
- Description: Returns a list of all assignments in the system.

Create a new assignment
- Method: POST /assignments
- Body: 
  Requires title, subject, classLevel, and dueDate.
  Also needs a questionConfigs array to define question types.

Delete an assignment
- Method: DELETE /assignments/:id
- Description: Deletes both the assignment and its generated questions.

Regenerate questions
- Method: POST /assignments/:id/regenerate
- Description: Re-runs the AI generation for an existing assignment.

Results API

Get the result
- Method: GET /results/:assignmentId
- Description: Returns the full set of generated questions and sections.

Example cURL call:
curl https://veda-ai-assessment.onrender.com/api/assignments
