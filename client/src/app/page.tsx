"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AssignmentResponse } from "@/types";
import { useIsMobile } from "@/hooks/useMobile";

export default function Dashboard() {
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments`);
        if (!res.ok) throw new Error("Server responded with error");
        const json = await res.json();
        if (json.success) {
          setAssignments(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch assignments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [router]);

  const filteredAssignments = assignments.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/assignments/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
         setAssignments(prev => prev.filter(a => a._id !== id));
      }
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Completed</span>;
      case "processing":
        return <span style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Processing</span>;
      case "failed":
        return <span style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Failed</span>;
      default:
        return <span style={{ backgroundColor: '#F3F4F6', color: '#374151', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>Pending</span>;
    }
  };

  if (loading || !mounted) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (assignments.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg viewBox="0 0 200 200" fill="none">
             <circle cx="100" cy="100" r="80" fill="#F3F4F6" />
             <path d="M70 60h60a10 10 0 0 1 10 10v60a10 10 0 0 1-10 10H70a10 10 0 0 1-10-10V70a10 10 0 0 1 10-10z" stroke="#D1D5DB" strokeWidth="2" fill="white"/>
             <rect x="75" y="75" width="40" height="4" rx="2" fill="#E5E7EB" />
             <rect x="75" y="85" width="25" height="4" rx="2" fill="#E5E7EB" />
             <circle cx="110" cy="110" r="35" fill="white" stroke="#D1D5DB" strokeWidth="2"/>
             <path d="M100 100l20 20M120 100l-20 20" stroke="#EF4444" strokeWidth="6" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="empty-state-title">No assignments yet</h2>
        <p className="empty-state-desc">
          Create your first assignment to start collecting and grading student submissions.
        </p>
        <Link href="/create">
          <button className="btn-create">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create Your First Assignment
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div onClick={() => setOpenMenuId(null)}>
      {isMobile ? (
        <div className="mobile-page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '24px' }}>
          <button className="mobile-back-btn" style={{ position: 'absolute', left: 0, width: '40px', height: '40px', borderRadius: '50%', background: '#F3F4F6', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 style={{ fontSize: '18px', fontWeight: 600 }}>Assignments</h1>
        </div>
      ) : (
        <div className="page-header" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="page-header-dot" style={{ backgroundColor: '#10B981', width: '12px', height: '12px' }}></div>
          <div>
            <h1 className="page-title" style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Assignments</h1>
            <p className="page-subtitle" style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Manage and create assignments for your classes.</p>
          </div>
        </div>
      )}

      <div className="toolbar" style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <button className="filter-btn" style={{ padding: '10px 24px', borderRadius: '999px', fontSize: '14px', color: '#6B7280', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '8px', minWidth: 'fit-content' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filter
        </button>

        <div className="search-box" style={{ margin: 0, flex: 1 }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder={isMobile ? "Search Name" : "Search Assignment"} 
            style={{ fontSize: '14px' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="assignments-grid">
        {filteredAssignments.map((assignment) => (
          <div 
            key={assignment._id} 
            className="assignment-card"
            onClick={() => router.push(`/output/${assignment._id}`)}
            style={{ cursor: 'pointer' }}
          >
            <button 
              className="assignment-card-menu-btn"
              onClick={(e) => {
                e.stopPropagation();
                setOpenMenuId(openMenuId === assignment._id ? null : assignment._id);
              }}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </button>

            {openMenuId === assignment._id && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => router.push(`/output/${assignment._id}`)}>View Assignment</div>
                <div className="dropdown-item danger" onClick={(e) => handleDelete(assignment._id, e)}>Delete</div>
              </div>
            )}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <h3 className="assignment-card-title" style={{ margin: 0 }}>{assignment.title}</h3>
              {getStatusBadge(assignment.status)}
            </div>
            
            <div className="assignment-card-meta">
              <span style={{ color: '#6B7280' }}>Assigned on : <strong style={{color: '#111827'}}>{assignment.createdAt ? new Date(assignment.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-') : 'N/A'}</strong></span>
              <span style={{ color: '#6B7280' }}>Due : <strong style={{color: '#111827'}}>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString('en-GB').replace(/\//g, '-') : 'N/A'}</strong></span>
            </div>
          </div>
        ))}
      </div>
      
      <Link href="/create">
        <button className="btn-create" style={{ 
          position: 'fixed', 
          bottom: '24px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          zIndex: 60, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
          backgroundColor: '#111827',
          padding: '14px 32px',
          borderRadius: '999px',
          fontSize: '15px',
          fontWeight: 600
        }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create Assignment
        </button>
      </Link>

      <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}} />
    </div>
  );
}
