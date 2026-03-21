"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: "Home", path: "/" },
    { name: "My Groups", icon: "Users", path: "/" },
    { name: "Library", icon: "Book", path: "/" },
    { name: "AI Toolkit", icon: "Tool", path: "/" },
  ];

  return (
    <>
      <Link href="/create">
        <button className="mobile-fab">+</button>
      </Link>

      <nav className="mobile-bottom-nav">
        {navItems.map((item) => (
          <Link key={item.name} href={item.path} style={{ textDecoration: 'none' }}>
            <div className={`m-nav-item ${pathname === item.path ? "active" : ""}`}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {item.icon === "Home" && (
                  <>
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </>
                )}
                {item.icon === "Users" && (
                  <>
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <circle cx="12" cy="10" r="3" />
                  </>
                )}
                {item.icon === "Book" && <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />}
                {item.icon === "Tool" && (
                  <>
                    <path d="M12 2L9 9l-7 3 7 3 3 7 3-7 7-3-7-3-3-7z" fill="currentColor" stroke="none" />
                  </>
                )}
              </svg>
              <span>{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </>
  );
}
