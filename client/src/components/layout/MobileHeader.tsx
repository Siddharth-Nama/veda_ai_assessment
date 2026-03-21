"use client";

import React from "react";

export default function MobileHeader() {
  return (
    <header className="mobile-header" style={{ 
      margin: '12px 16px', 
      borderRadius: '999px', 
      height: '56px', 
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      border: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      background: 'white',
      justifyContent: 'space-between'
    }}>
      <div className="mobile-header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className="sidebar-logo-icon" style={{ width: '32px', height: '32px', fontSize: '16px' }}>V</div>
        <span className="sidebar-logo-text" style={{ fontSize: '18px', color: '#1A1A1A', fontWeight: 700 }}>VedaAI</span>
      </div>
      
      <div className="mobile-header-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="header-icon-btn" style={{ width: '36px', height: '36px', position: 'relative' }}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="header-notif-dot" style={{ top: '6px', right: '6px' }}></span>
        </button>
        
        <div className="header-avatar" style={{ width: '36px', height: '36px', border: '1px solid #E5E7EB', borderRadius: '50%', overflow: 'hidden' }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" color="#6B7280">
               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
               <circle cx="12" cy="7" r="4" />
            </svg>
        </div>
        
        <button className="header-icon-btn" style={{ width: '36px', height: '36px' }}>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}
