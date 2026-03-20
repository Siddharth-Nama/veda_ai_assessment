import React from "react";
import { useAssignmentStore } from "@/store/assignmentStore";

export default function AdditionalInstructions() {
  const { data, updateField } = useAssignmentStore();

  return (
    <div style={{ marginBottom: '2rem' }}>
      <label className="label-text">Additional Instructions (Optional)</label>
      <textarea 
        value={data.additionalInstructions}
        onChange={(e) => updateField("additionalInstructions", e.target.value)}
        placeholder="Enter any specific instructions or focus areas for the AI..."
        style={{ 
          width: '100%', 
          minHeight: '120px', 
          resize: 'vertical' 
        }}
      />
    </div>
  );
}
