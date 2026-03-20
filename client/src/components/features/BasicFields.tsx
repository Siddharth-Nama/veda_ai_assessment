import React from "react";
import { useAssignmentStore } from "@/store/assignmentStore";

export default function BasicFields() {
  const { data, updateField } = useAssignmentStore();

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
      <div>
        <label className="label-text">Select Subject</label>
        <input 
          type="text" 
          value={data.subject}
          onChange={(e) => updateField("subject", e.target.value)}
          placeholder="e.g., Mathematics"
          style={{ width: '100%' }}
          required
        />
      </div>

      <div>
        <label className="label-text">Select Class</label>
        <select 
          value={data.classLevel}
          onChange={(e) => updateField("classLevel", e.target.value)}
          style={{ width: '100%' }}
          required
        >
          <option value="" disabled>Select Class</option>
          <option value="9">Class 9</option>
          <option value="10">Class 10</option>
          <option value="11">Class 11</option>
          <option value="12">Class 12</option>
        </select>
      </div>

      <div>
        <label className="label-text">Section</label>
        <input 
          type="text" 
          value={data.section}
          onChange={(e) => updateField("section", e.target.value)}
          placeholder="e.g., A, B, C"
          style={{ width: '100%' }}
        />
      </div>

      <div>
        <label className="label-text">Set Due Date</label>
        <input 
          type="date" 
          value={data.dueDate}
          onChange={(e) => updateField("dueDate", e.target.value)}
          style={{ width: '100%' }}
          required
        />
      </div>
      
      <div style={{ gridColumn: '1 / -1' }}>
        <label className="label-text">Assignment Title / Topic</label>
        <input 
          type="text" 
          value={data.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g., Trigonometry Basics"
          style={{ width: '100%' }}
          required
        />
      </div>
    </div>
  );
}
