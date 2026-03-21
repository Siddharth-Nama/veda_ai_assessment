"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: "Home", path: "/dashboard" },
    { name: "Assignments", icon: "FileText", path: "/" },
    { name: "Library", icon: "Book", path: "/library" },
    { name: "AI Toolkit", icon: "Tool", path: "/toolkit" },
  ];

  return (
    <>
      <Link href="/create">
        <button className="fab-btn" style={{ 
          background: '#FFFFFF', 
          color: '#FF4D00', 
          width: '56px', 
          height: '56px', 
          fontSize: '28px', 
          fontWeight: 'light',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          bottom: '100px',
          right: '20px',
          borderRadius: '50%',
          zIndex: 100,
          border: 'none'
        }}>
          +
        </button>
      </Link>

      <nav className="bottom-nav" style={{ 
        background: '#111827', 
        borderTop: 'none', 
        height: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-around',
        padding: '0 10px'
      }}>
        {navItems.map((item) => (
          <Link key={item.name} href={item.path} style={{ textDecoration: 'none' }}>
            <div className={`bottom-nav-item ${pathname === item.path ? "active" : ""}`} style={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: pathname === item.path ? '#FFFFFF' : '#9CA3AF',
              gap: '6px'
            }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {item.icon === "Home" && (
                  <>
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </>
                )}
                {item.icon === "FileText" && <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" />}
                {item.icon === "Book" && <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />}
                {item.icon === "Tool" && (
                  <>
                    <path d="M9 2L7.17 7.17L2 9L7.17 10.83L9 16L10.83 10.83L16 9L10.83 7.17L9 2Z" fill="currentColor" stroke="none" />
                    <path d="M19 13L18.14 15.14L16 16L18.14 16.86L19 19L19.86 16.86L22 16L19.86 15.14L19 13Z" fill="currentColor" stroke="none" />
                  </>
                )}
              </svg>
              <span style={{ fontSize: '10px', fontWeight: pathname === item.path ? 600 : 400 }}>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </>
  );
}
