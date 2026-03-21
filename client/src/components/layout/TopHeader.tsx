"use client";

import React from "react";

export default function TopHeader() {
  return (
    <header className="top-header">
      <button className="header-back-btn">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="header-breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF', fontSize: '14px' }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
        Assignment
      </div>

      <div className="header-right">
        <button className="header-icon-btn">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="header-notif-dot" style={{ top: '8px', right: '8px' }}></span>
        </button>
        
        <div className="header-user-info">
          <div className="header-avatar" style={{ border: '1px solid #E5E7EB' }}>
            {/* Using a placeholder for the avatar in the image */}
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
               <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <span style={{ fontWeight: 600 }}>John Doe</span>
          <svg className="header-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}
