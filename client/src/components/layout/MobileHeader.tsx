"use client";

import React from "react";

export default function MobileHeader() {
  return (
    <header className="mobile-header">
      <div className="mobile-header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="sidebar-logo-icon" style={{ width: '32px', height: '32px', fontSize: '16px', borderRadius: '8px' }}>V</div>
        <span className="mobile-logo-text" style={{ fontSize: '18px', fontWeight: 800 }}>VedaAI</span>
      </div>
      
      <div className="mobile-header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="header-icon-btn" style={{ width: '36px', height: '36px', border: 'none', background: '#F3F4F6' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="header-notif-dot" style={{ top: '6px', right: '6px' }}></span>
        </button>
        
        <img 
          src="https://ui-avatars.com/api/?name=John+Doe&background=random" 
          alt="User" 
          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #E5E7EB' }}
        />
        
        <button className="header-icon-btn" style={{ width: '36px', height: '36px', border: 'none', background: 'none' }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}
