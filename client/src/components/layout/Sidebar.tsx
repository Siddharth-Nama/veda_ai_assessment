"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--card-bg)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-color)' }}>
          VedaAI
        </h2>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link 
          href="/"
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            backgroundColor: pathname === "/" ? 'rgba(0, 112, 243, 0.1)' : 'transparent',
            color: pathname === "/" ? 'var(--primary-color)' : 'var(--text-secondary)',
            fontWeight: pathname === "/" ? 600 : 500,
            transition: 'all 0.2s',
          }}
        >
          Create Assignment
        </Link>
      </nav>
      
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
        <p>VedaAI Assessment System</p>
      </div>
    </aside>
  );
}
