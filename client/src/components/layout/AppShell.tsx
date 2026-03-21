"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopHeader from "@/components/layout/TopHeader";
import MobileHeader from "@/components/layout/MobileHeader";
import BottomNav from "@/components/layout/BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // During SSR and before hydration, we render a stable "Desktop-ish" shell
  // but with suppressHydrationWarning to avoid extension attribute errors
  if (!mounted) {
    return (
      <div className="app-shell" suppressHydrationWarning>
        <Sidebar />
        <div className="main-wrapper" style={{ marginLeft: 'var(--sidebar-width)' }}>
          <TopHeader />
          <main className="page-content">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell" suppressHydrationWarning>
      {!isMobile && <Sidebar />}
      <div className="main-wrapper" style={{ marginLeft: isMobile ? 0 : 'var(--sidebar-width)' }} suppressHydrationWarning>
        {isMobile ? <MobileHeader /> : <TopHeader />}
        <main className="page-content" suppressHydrationWarning>
          {children}
        </main>
        {isMobile && <BottomNav />}
      </div>
    </div>
  );
}
