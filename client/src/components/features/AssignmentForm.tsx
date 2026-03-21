"use client";

import React, { useState } from "react";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useRouter } from "next/navigation";

export default function AssignmentForm() {
  const { data, updateField, addQuestionConfig, updateQuestionConfig, removeQuestionConfig } = useAssignmentStore();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const totalQuestions = data.questionConfigs.reduce((acc, curr) => acc + curr.count, 0);
  const totalMarks = data.questionConfigs.reduce((acc, curr) => acc + (curr.count * curr.marks), 0);

  const validateForm = () => {
    if (!data.title.trim()) return "Assignment Title is required";
    if (!data.subject.trim()) return "Subject is required";
    if (!data.classLevel) return "Class is required";
    if (!data.dueDate) return "Due Date is required";
    if (data.questionConfigs.length === 0) return "At least one question type is required";
    return null;
  };

  const handleStepper = (id: string, field: "count" | "marks", type: "inc" | "dec", currentValue: number) => {
    let newValue = type === "inc" ? currentValue + 1 : currentValue - 1;
    if (newValue < 1) newValue = 1;
    updateQuestionConfig(id, field, newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Failed to create assignment");
      router.push(`/output/${result.data.assignmentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-form-container">
      <div className="form-section-title">Assignment Details</div>
      <p className="form-section-desc">Design a new question paper using AI by providing details.</p>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
            <label className="form-label">Assignment Title</label>
            <input 
              className="form-input" 
              placeholder="Enter assignment title (e.g. Algebra Mastery)" 
              value={data.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
        </div>

        <div className="file-upload-area" style={{ marginBottom: '24px' }}>
          <div className="file-upload-icon">📁</div>
          <div className="file-upload-text">
            <strong>Choose a file</strong> or drag & drop it here <br />
            JPEG, PNG, PDF, DOC
          </div>
          <button type="button" className="btn-outline" style={{ marginTop: '12px', padding: '6px 16px' }}>Browse Files</button>
        </div>

        <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">Subject</label>
              <select className="form-input" value={data.subject} onChange={(e) => updateField("subject", e.target.value)}>
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Social Studies">Social Studies</option>
              </select>
            </div>
            <div className="form-field">
              <label className="form-label">Class</label>
              <select className="form-input" value={data.classLevel} onChange={(e) => updateField("classLevel", e.target.value)}>
                <option value="">Select Class</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>
        </div>

        <div className="form-field">
          <label className="form-label">Due Date</label>
          <input 
            type="date" 
            className="form-input" 
            value={data.dueDate}
            onChange={(e) => updateField("dueDate", e.target.value)}
          />
        </div>

        <div className="form-section-title" style={{ marginTop: '28px' }}>Question Type</div>
        
        <table className="question-table">
          <thead>
            <tr>
              <th>Type of Questions</th>
              <th>No of Questions</th>
              <th>Marks</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.questionConfigs.map((config) => (
              <tr key={config.id}>
                <td>
                  <select 
                    className="form-input" 
                    style={{ padding: '6px 10px' }}
                    value={config.type}
                    onChange={(e) => updateQuestionConfig(config.id, "type", e.target.value)}
                  >
                    <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                    <option value="Short Questions">Short Questions</option>
                    <option value="Long Questions">Long Questions</option>
                    <option value="Objective-based Questions">Objective-based Questions</option>
                    <option value="Numerical Problems">Numerical Problems</option>
                  </select>
                </td>
                <td>
                  <div className="stepper">
                    <button type="button" className="stepper-btn" onClick={() => handleStepper(config.id, "count", "dec", config.count)}>-</button>
                    <div className="stepper-value">{config.count}</div>
                    <button type="button" className="stepper-btn" onClick={() => handleStepper(config.id, "count", "inc", config.count)}>+</button>
                  </div>
                </td>
                <td>
                  <div className="stepper">
                    <button type="button" className="stepper-btn" onClick={() => handleStepper(config.id, "marks", "dec", config.marks)}>-</button>
                    <div className="stepper-value">{config.marks}</div>
                    <button type="button" className="stepper-btn" onClick={() => handleStepper(config.id, "marks", "inc", config.marks)}>+</button>
                  </div>
                </td>
                <td>
                  {data.questionConfigs.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeQuestionConfig(config.id)}
                      style={{ color: 'var(--danger)', fontSize: '18px' }}
                    >
                      ×
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" className="add-type-btn" onClick={addQuestionConfig}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Question Type
        </button>

        <div className="marks-totals">
          <span>Total Questions: <strong>{totalQuestions}</strong></span>
          <span>Total Marks: <strong>{totalMarks}</strong></span>
        </div>

        <div className="form-field" style={{ marginTop: '24px' }}>
          <label className="form-label">Additional Information (by human output)</label>
          <textarea 
            className="form-input" 
            rows={4} 
            placeholder="e.g. Focus on chapter 5, include real-world applications..."
            value={data.additionalInstructions}
            onChange={(e) => updateField("additionalInstructions", e.target.value)}
          />
        </div>

        <div className="form-footer">
          <button type="button" className="btn-outline" onClick={() => router.push("/")}>Previous</button>
          <button type="submit" className="btn-primary-dark" disabled={isSubmitting}>
             {isSubmitting ? "Generating..." : "Next →"}
          </button>
        </div>
      </form>
    </div>
  );
}
