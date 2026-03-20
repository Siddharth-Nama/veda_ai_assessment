"use client";

import React, { useState } from "react";
import FileUpload from "./FileUpload";
import BasicFields from "./BasicFields";
import QuestionConfig from "./QuestionConfig";
import AdditionalInstructions from "./AdditionalInstructions";
import { useAssignmentStore } from "@/store/assignmentStore";
import { useRouter } from "next/navigation";

export default function AssignmentForm() {
  const { data } = useAssignmentStore();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!data.title.trim()) return "Assignment Title is required";
    if (!data.subject.trim()) return "Subject is required";
    if (!data.classLevel) return "Class is required";
    if (!data.dueDate) return "Due Date is required";
    
    if (data.questionConfigs.length === 0) return "At least one question type is required";
    
    for (const config of data.questionConfigs) {
      if (config.count < 1) return `Count must be at least 1 for ${config.type}`;
      if (config.marks < 1) return `Marks must be at least 1 for ${config.type}`;
    }
    
    return null;
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
      
      if (!result.success) {
        throw new Error(result.message || "Failed to create assignment");
      }
      
      router.push(`/output/${result.data.assignmentId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      {error && (
        <div style={{ backgroundColor: 'var(--danger)', color: 'white', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <FileUpload />
        <BasicFields />
        <QuestionConfig />
        <AdditionalInstructions />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={isSubmitting}
            style={{ padding: '0.75rem 2rem' }}
          >
            {isSubmitting ? "Generating..." : "Generate Question Paper"}
          </button>
        </div>
      </form>
    </div>
  );
}
