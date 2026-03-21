"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: "Home", path: "/" },
    { name: "My Groups", icon: "Users", path: "/" },
    { name: "Assignments", icon: "FileText", path: "/", badge: 10 },
    { name: "AI Teacher's Toolkit", icon: "Tool", path: "/" },
    { name: "My Library", icon: "Book", path: "/" },
  ];

  return (
    <aside className="sidebar" style={{ background: '#FFFFFF', padding: '24px 20px' }}>
      <div className="sidebar-logo" style={{ marginBottom: '32px' }}>
        <div className="sidebar-logo-icon">V</div>
        <span className="sidebar-logo-text" style={{ color: '#1A1A1A' }}>VedaAI</span>
      </div>

      <Link href="/create">
        <button className="sidebar-create-btn" style={{ marginBottom: '40px' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
            <path d="M9 2L7.17 7.17L2 9L7.17 10.83L9 16L10.83 10.83L16 9L10.83 7.17L9 2Z" />
            <path d="M19 13L18.14 15.14L16 16L18.14 16.86L19 19L19.86 16.86L22 16L19.86 15.14L19 13Z" />
          </svg>
          Create Assignment
        </button>
      </Link>

      <nav className="sidebar-nav" style={{ gap: '4px' }}>
        {navItems.map((item) => (
          <Link key={item.name} href={item.path}>
            <div className={`nav-item ${pathname === item.path ? "active" : ""}`} style={{ padding: '12px 16px' }}>
              <span className="nav-icon" style={{ marginRight: '12px' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: pathname === item.path ? 1 : 0.6 }}>
                  {item.icon === "Home" && (
                    <>
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                    </>
                  )}
                  {item.icon === "Users" && <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M12 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />}
                  {item.icon === "FileText" && <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" />}
                  {item.icon === "Tool" && <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />}
                  {item.icon === "Book" && <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />}
                </svg>
              </span>
              <span style={{ fontSize: '15px', fontWeight: pathname === item.path ? 600 : 500 }}>{item.name}</span>
              {item.badge && <span className="nav-item-badge">{item.badge}</span>}
            </div>
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-settings" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px', color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          Settings
        </div>
        
        <div className="school-card">
          <div className="school-avatar" style={{ borderRadius: '12px' }}>
             <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
               <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
             </svg>
          </div>
          <div className="school-info">
            <div className="school-name" style={{ fontSize: '14px', fontWeight: 700 }}>Delhi Public School</div>
            <div className="school-location" style={{ fontSize: '12px' }}>Bokaro Steel City</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
