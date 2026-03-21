"use client";

import React, { useState, useMemo } from "react";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useRouter } from "next/navigation";

export default function AssignmentForm() {
  const { data, updateField, addQuestionConfig, updateQuestionConfig, removeQuestionConfig } = useAssignmentStore();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const totalQuestions = useMemo(() => {
    return data.questionConfigs.reduce((sum, q) => sum + (q.count || 0), 0);
  }, [data.questionConfigs]);

  const totalMarks = useMemo(() => {
    return data.questionConfigs.reduce((sum, q) => sum + (q.count * q.marks || 0), 0);
  }, [data.questionConfigs]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setError("File size should be less than 50MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateField("fileContent", base64);
      updateField("fileName", file.name);
    };
    reader.readAsDataURL(file);
  };

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
    <div className="page-container" style={{ paddingTop: '20px' }}>
      {/* Progress Bar Area */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '2px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', height: '100%', background: '#4B5563', borderRadius: '2px' }}></div>
        </div>
      </div>

      <div className="content-header" style={{ padding: '0 24px' }}>
        <div className="status-dot" style={{ background: '#10B981', width: '12px', height: '12px', borderRadius: '50%', marginTop: '8px' }}></div>
        <div>
          <h1 className="content-title" style={{ fontSize: '26px', fontWeight: 800 }}>Create Assignment</h1>
          <p className="content-subtitle" style={{ fontSize: '14px', color: '#6B7280' }}>Set up a new assignment for your students</p>
        </div>
      </div>

      <div className="form-card">
        <h2 className="card-section-title">Assignment Details</h2>
        <p className="card-section-subtitle">Basic information about your assignment</p>

        {error && <div style={{ color: '#F94A29', marginBottom: '20px', fontSize: '14px', fontWeight: 600 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Upload Area */}
          <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileChange}
            />
            <div className="upload-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 10v9m0-9l-3 3m3-3l3 3M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p className="upload-text">
              {data.fileName ? data.fileName : "Choose a file or drag & drop it here"}
            </p>
            <p className="upload-hint">PDF, TXT, DOC, up to 10MB</p>
            <button type="button" className="browse-btn">Browse Files</button>
          </div>

          <div style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center', marginBottom: '32px' }}>
            Upload content for your preferred document
          </div>

          {/* Grid for Subject/Class */}
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div className="input-group">
              <label className="input-label">Subject</label>
              <select className="input-field" value={data.subject} onChange={(e) => updateField("subject", e.target.value)}>
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="English">English</option>
                <option value="Social Studies">Social Studies</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Class</label>
              <select className="input-field" value={data.classLevel} onChange={(e) => updateField("classLevel", e.target.value)}>
                <option value="">Select Class</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="input-group">
            <label className="input-label">Due Date</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="date" 
                className="input-field" 
                value={data.dueDate}
                onChange={(e) => updateField("dueDate", e.target.value)}
              />
            </div>
          </div>

          <div className="card-section-title" style={{ marginTop: '40px', fontSize: '16px' }}>Question Type</div>
          
          <div className="question-list" style={{ marginTop: '20px' }}>
             {/* Labels for headers shown in desktop */}
             <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', paddingRight: '40px', fontSize: '12px', fontWeight: 600, color: '#9CA3AF' }}>
                <div style={{ flex: 1 }}>Question Type</div>
                <div style={{ width: '120px', textAlign: 'center' }}>No. of Questions</div>
                <div style={{ width: '120px', textAlign: 'center' }}>Marks</div>
             </div>

            {data.questionConfigs.map((config) => (
              <div key={config.id} className="question-row" style={{ marginBottom: '12px' }}>
                <select 
                  className="question-select"
                  value={config.type}
                  onChange={(e) => updateQuestionConfig(config.id, "type", e.target.value)}
                >
                  <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                  <option value="Short Questions">Short Questions</option>
                  <option value="Diagram/Graph Based Questions">Diagram/Graph Based Questions</option>
                  <option value="Numerical Problems">Numerical Problems</option>
                </select>

                <div className="stepper" style={{ width: '120px' }}>
                  <button type="button" className="stepper-btn" onClick={() => handleStepper(config.id, "count", "dec", config.count)}>−</button>
                  <span className="stepper-value">{config.count}</span>
                  <button type="button" className="stepper-btn" onClick={() => handleStepper(config.id, "count", "inc", config.count)}>+</button>
                </div>

                <div className="stepper" style={{ width: '120px' }}>
                  <button type="button" className="stepper-btn" onClick={() => handleStepper(config.id, "marks", "dec", config.marks)}>−</button>
                  <span className="stepper-value">{config.marks}</span>
                  <button type="button" className="stepper-btn" onClick={() => handleStepper(config.id, "marks", "inc", config.marks)}>+</button>
                </div>

                <button 
                  type="button" 
                  onClick={() => removeQuestionConfig(config.id)}
                  style={{ color: '#9CA3AF', fontSize: '20px', border: 'none', background: 'none' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="add-type-btn" onClick={addQuestionConfig}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'black', fontSize: '18px', fontWeight: 800 }}>+</div>
            Add Question Type
          </button>

          <div style={{ textAlign: 'right', marginTop: '24px', fontSize: '14px', fontWeight: 600, color: '#1A1A1A' }}>
            <div style={{ marginBottom: '4px' }}>Total Questions : {totalQuestions}</div>
            <div>Total Marks : {totalMarks}</div>
          </div>

          <div className="input-group" style={{ marginTop: '40px' }}>
            <label className="input-label">Additional Information (For better output)</label>
            <div style={{ position: 'relative' }}>
              <textarea 
                className="input-field" 
                rows={4} 
                placeholder="e.g Generate a question paper for 3 hour exam duration..."
                value={data.additionalInstructions}
                onChange={(e) => updateField("additionalInstructions", e.target.value)}
                style={{ borderRadius: '20px', paddingBottom: '40px' }}
              />
              <div style={{ position: 'absolute', right: '16px', bottom: '16px' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
                </svg>
              </div>
            </div>
          </div>

          <div className="form-footer">
            <button type="button" className="footer-btn btn-prev" onClick={() => router.push("/")}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            <button type="submit" className="footer-btn btn-next" disabled={isSubmitting}>
              {isSubmitting ? "Generating..." : "Next →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
