"use client";

import { useState } from "react";

export default function AssignmentForm() {
  const [title, setTitle] = useState("");
  
  return (
    <div className="card">
      <form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label className="label-text">Assignment Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Mathematics Mid-Term"
              style={{ width: '100%', maxWidth: '400px' }}
            />
          </div>
          <div>
            <button type="button" className="btn-primary">Placeholder Submit</button>
          </div>
        </div>
      </form>
    </div>
  );
}
