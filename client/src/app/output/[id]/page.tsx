"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWebSocket } from "@/lib/useWebSocket";
import { AssignmentResponse, GeneratedPaper } from "@/types";

export default function OutputPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  
  const [assignment, setAssignment] = useState<AssignmentResponse | null>(null);
  const [result, setResult] = useState<GeneratedPaper | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { progress } = useWebSocket(assignmentId);

  useEffect(() => {
    if (!assignmentId) return;

    const fetchData = async () => {
      try {
        const [aRes, rRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/results/${assignmentId}`)
        ]);
        
        const aJson = await aRes.json();
        const rJson = await rRes.json();
        
        if (aJson.success) setAssignment(aJson.data);
        if (rJson.success) setResult(rJson.data);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId]);

  useEffect(() => {
    if (!assignmentId || result) return;

    if (assignment?.status === "completed" || progress?.status === "completed") {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/results/${assignmentId}`)
        .then(res => res.json())
        .then(json => {
           if (json.success) setResult(json.data);
        });
    }
  }, [assignmentId, assignment?.status, progress?.status, result]);

  const handleRegenerate = async () => {
    if (!assignmentId) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${assignmentId}/regenerate`, { method: "POST" });
      const json = await res.json();
      if (json.success) {
        setResult(null);
        setAssignment({ ...assignment!, status: "processing" });
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to regenerate", err);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  const status = progress?.status || assignment?.status;

  if (status === "failed") {
    return (
      <div className="empty-state">
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
        <h2 className="empty-state-title">Generation Failed</h2>
        <p className="empty-state-desc">Something went wrong while creating your question paper. This could be due to a complex prompt or temporary AI downtime.</p>
        <button onClick={handleRegenerate} className="btn-primary-dark" style={{ marginTop: '20px' }}>Try Again</button>
      </div>
    );
  }

  if (status === "pending" || status === "processing") {
    return (
      <div className="empty-state">
        <div style={{ width: '48px', height: '48px', border: '4px solid #E5E7EB', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }} />
        <h2 className="empty-state-title">Generating Question Paper...</h2>
        <p className="empty-state-desc">{progress?.message || "AI is curating your custom assessment. This usually takes 30-40 seconds."}</p>
        <div style={{ width: '100%', maxWidth: '300px', height: '6px', background: '#E5E7EB', borderRadius: '3px', marginTop: '20px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--primary)', width: `${progress?.progress || 20}%`, transition: 'width 0.4s ease' }}></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="empty-state">
        <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '20px', color: '#6B7280' }}>Loading final results...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div className="dark-banner" style={{ 
        backgroundColor: '#1F2937', 
        borderRadius: '16px', 
        padding: '24px 32px', 
        color: 'white', 
        marginBottom: '32px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#E5E7EB', opacity: 0.9 }}>
          Your customized Question Paper for {result.classLevel} {result.subject} is ready based on your instructions.
        </p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => window.print()}
            className="btn-outline" 
            style={{ width: 'fit-content', color: 'white', borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'transparent', padding: '8px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              Download PDF
            </div>
          </button>
          <button 
            onClick={handleRegenerate}
            className="btn-outline" 
            style={{ width: 'fit-content', color: 'white', borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'transparent', padding: '8px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(0deg)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              Regenerate
            </div>
          </button>
        </div>
      </div>

      {/* Styled Question Paper */}
      <div className="card" id="question-paper" style={{ padding: '60px 80px', boxShadow: '0 4px 30px rgba(0,0,0,0.05)', borderRadius: '24px', border: '1px solid #E5E7EB' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>{result.schoolName}</h1>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)' }}>Subject: {result.subject}</h2>
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-secondary)' }}>Class: {result.classLevel}</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '12px', marginBottom: '24px', fontWeight: 600, fontSize: '14px' }}>
          <span>Time Allowed: {result.timeAllowed}</span>
          <span>Maximum Marks: {result.maxMarks}</span>
        </div>

        <p style={{ fontStyle: 'italic', fontSize: '14px', marginBottom: '32px', color: 'var(--text-secondary)' }}>
          All questions are compulsory unless stated otherwise.
        </p>

        <div style={{ marginBottom: '48px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>Name: ____________________________</div>
          <div>Roll Number: ____________________________</div>
          <div>{result.classLevel} Section: ____________________________</div>
        </div>

        {result.sections.map((section, sIndex) => (
          <div key={sIndex} style={{ marginBottom: '40px' }}>
            <h3 style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, marginBottom: '24px', textDecoration: 'underline' }}>{section.title}</h3>
            
            <p style={{ fontWeight: 600, marginBottom: '16px', fontSize: '15px' }}>{section.questionType}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', fontStyle: 'italic' }}>{section.instruction}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {section.questions.map((q, qIndex) => (
                <div key={qIndex} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: 600, minWidth: '24px' }}>{q.questionNumber}.</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ marginBottom: '8px', fontSize: '15px', lineHeight: '1.5' }}>
                      ({q.difficulty}) {q.questionText}
                    </p>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>[{q.marks} Marks]</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '60px', borderTop: '1px solid #E5E7EB', paddingTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
          End of Question Paper
        </div>

        {/* Answer Key */}
        <div style={{ marginTop: '80px', borderTop: '2px dashed #E5E7EB', paddingTop: '40px', pageBreakBefore: 'always' }}>
           <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>Answer Key:</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {result.sections.flatMap(s => s.questions).map((q, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
                  <span style={{ fontWeight: 600, minWidth: '24px' }}>{q.questionNumber}.</span>
                  <p>{q.answer}</p>
                </div>
              ))}
           </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          .app-shell .sidebar, .top-header, .mobile-header, .bottom-nav, .dark-banner { display: none !important; }
          .main-wrapper { margin-left: 0 !important; }
          .page-content { padding: 0 !important; }
          .card { border: none !important; box-shadow: none !important; width: 100% !important; max-width: none !important; margin: 0 !important; padding: 0 !important; }
          body { background: white !important; }
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}}/>
    </div>
  );
}
