"use client";

import React from "react";

export default function TopHeader() {
  return (
    <header className="top-header">
      <button className="header-back-btn">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div className="header-breadcrumb">
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
          </svg>
          Assignment
        </span>
      </div>

      <div className="header-right">
        <button className="header-icon-btn">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="header-notif-dot"></span>
        </button>
        
        <div className="header-user-info">
          <img 
            src="https://ui-avatars.com/api/?name=John+Doe&background=random" 
            alt="User" 
            className="header-avatar-img" 
          />
          <span>John Doe</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}
