"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWebSocket } from "@/lib/useWebSocket";
import { AssignmentResponse, GeneratedPaper } from "@/types";
import jsPDF from "jspdf";

export default function OutputPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  
  const [assignment, setAssignment] = useState<AssignmentResponse | null>(null);
  const [result, setResult] = useState<GeneratedPaper | null>(null);
  const [error, setError] = useState("");
  
  const { progress } = useWebSocket(assignmentId);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchAssignment = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}`);
        const json = await res.json();
        if (json.success) setAssignment(json.data);
      } catch (err) {
        console.error("Failed to fetch assignment", err);
      }
    };

    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchResult = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/results/${assignmentId}`);
        const json = await res.json();
        if (json.success) {
          setResult(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch result", err);
      }
    };

    if (assignment?.status === "completed" || progress?.status === "completed") {
      fetchResult();
    }
  }, [assignmentId, assignment?.status, progress?.status]);

  const handleRegenerate = async () => {
    try {
      setResult(null);
      setAssignment(prev => prev ? { ...prev, status: "processing" } : null);
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}/regenerate`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to regenerate", err);
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById("question-paper");
    if (!element) return;
    
    // Simple jsPDF implementation for now
    const pdf = new jsPDF("p", "mm", "a4");
    
    // We would use an html2canvas library here for perfect rendering,
    // but without adding another dependency we'll use a basic approach
    // For a production app, we'd add html2canvas and use it here.
    pdf.setFont("helvetica");
    pdf.setFontSize(16);
    pdf.text(result?.schoolName || "Assessment", 105, 20, { align: "center" });
    
    pdf.setFontSize(12);
    pdf.text(`Subject: ${result?.subject}`, 20, 35);
    pdf.text(`Class: ${result?.classLevel}`, 150, 35);
    
    pdf.text(`Time: ${result?.timeAllowed}`, 20, 45);
    pdf.text(`Max Marks: ${result?.maxMarks}`, 150, 45);
    
    pdf.setLineWidth(0.5);
    pdf.line(20, 50, 190, 50);
    
    pdf.text("Please use browser print (Ctrl+P) and Save to PDF for full formatting.", 20, 70);
    pdf.text("The layout is optimized for standard A4 printing.", 20, 80);
    
    pdf.save(`${result?.subject}_Class_${result?.classLevel}_Assessment.pdf`);
  };

  if (error) {
    return (
      <div className="card" style={{ borderColor: 'var(--danger)' }}>
        <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Error</h2>
        <p>{error}</p>
        <button className="btn-primary" onClick={() => router.push("/")} style={{ marginTop: '1rem' }}>
          Back to Home
        </button>
      </div>
    );
  }

  const currentStatus = progress?.status || assignment?.status;

  if (currentStatus === "pending" || currentStatus === "processing") {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem' }}>
        <div style={{ width: '48px', height: '48px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
          Generating Question Paper...
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {progress?.message || "AI is processing your request. Please wait."}
        </p>
        <div style={{ width: '100%', maxWidth: '400px', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', marginTop: '2rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', backgroundColor: 'var(--primary-color)', width: `${progress?.progress || 10}%`, transition: 'width 0.3s ease' }} />
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  if (currentStatus === "failed") {
    return (
      <div className="card" style={{ borderColor: 'var(--danger)', textAlign: 'center', padding: '3rem' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: '#FEF2F2', color: 'var(--danger)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 1.5rem auto' }}>
          !
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Generation Failed</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {progress?.message || "An error occurred while generating the question paper."}
        </p>
        <button className="btn-primary" onClick={() => router.push("/")}>
          Try Again
        </button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={() => router.push("/")} className="btn-secondary">
          &larr; Back
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleRegenerate} className="btn-secondary">
            Regenerate
          </button>
          <button onClick={() => window.print()} className="btn-primary">
            Print / Save PDF
          </button>
          <button onClick={downloadPDF} className="btn-secondary" style={{ display: 'none' }}>
            Raw PDF
          </button>
        </div>
      </div>
      
      <div className="card" id="question-paper" style={{ padding: '3rem 4rem' }}>
        {/* Paper Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid var(--text-primary)', paddingBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
            {result.schoolName}
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
            <div>Subject: {result.subject}</div>
            <div>Class: {result.classLevel}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <div>Time Allowed: {result.timeAllowed}</div>
            <div>Max Marks: {result.maxMarks}</div>
          </div>
        </div>

        {/* General Instructions */}
        {result.generalInstructions?.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>General Instructions:</h3>
            <ul style={{ paddingLeft: '1.5rem', margin: 0 }}>
              {result.generalInstructions.map((inst, i) => (
                <li key={i} style={{ marginBottom: '0.25rem' }}>{inst}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Student Info */}
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
          <div style={{ flex: 1 }}>Name: ______________________</div>
          <div>Roll No: ______________________</div>
          <div>Section: ______________________</div>
        </div>

        {/* Sections */}
        <div>
          {result.sections.map((section, sIndex) => (
            <div key={sIndex} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{section.title}</h3>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  ({section.questionType} - {section.marksPerQuestion} mark{section.marksPerQuestion > 1 ? 's' : ''} each)
                </span>
              </div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem' }}>{section.instruction}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {section.questions.map((q, qIndex) => (
                  <div key={qIndex} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>Q{q.questionNumber}.</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ marginBottom: '0.5rem' }}>{q.questionText}</p>
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <span className={`badge badge-${q.difficulty}`}>{q.difficulty}</span>
                        <span className="badge" style={{ backgroundColor: '#F3F4F6', color: 'var(--text-secondary)' }}>
                          [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '4rem', fontWeight: 600 }}>
          *** END OF QUESTION PAPER ***
        </div>

        {/* Answer Key */}
        <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '2rem', pageBreakBefore: 'always' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Answer Key</h2>
          
          {result.sections.map((section, sIndex) => (
            <div key={`ans-${sIndex}`} style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>{section.title}</h4>
              <div style={{ paddingLeft: '1rem' }}>
                {section.questions.map((q, qIndex) => (
                  <div key={`ans-q-${qIndex}`} style={{ marginBottom: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 500, minWidth: '40px' }}>Q{q.questionNumber}.</span>
                    <span>{q.answer || "Answer not provided"}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
