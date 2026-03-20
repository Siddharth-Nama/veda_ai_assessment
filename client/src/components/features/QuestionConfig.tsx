import React from "react";
import { useAssignmentStore } from "@/store/assignmentStore";

export default function QuestionConfig() {
  const { data, addQuestionConfig, updateQuestionConfig, removeQuestionConfig } = useAssignmentStore();

  const handleStepper = (id: string, field: "count" | "marks", type: "inc" | "dec", currentValue: number) => {
    let newValue = type === "inc" ? currentValue + 1 : currentValue - 1;
    if (newValue < 1) newValue = 1;
    updateQuestionConfig(id, field, newValue);
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <label className="label-text">Question Types & Marking</label>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
        {data.questionConfigs.map((config, index) => (
          <div key={config.id} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'minmax(150px, 2fr) 1fr 1fr auto', 
            gap: '1rem',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
          }}>
            <select 
              value={config.type}
              onChange={(e) => updateQuestionConfig(config.id, "type", e.target.value)}
              style={{ width: '100%', backgroundColor: 'white' }}
            >
              <option value="MCQ">Multiple Choice</option>
              <option value="Objective">Objective</option>
              <option value="Short Answer">Short Answer</option>
              <option value="Long Answer">Long Answer</option>
              <option value="Numerical">Numerical</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.25rem' }}>
              <button 
                type="button"
                onClick={() => handleStepper(config.id, "count", "dec", config.count)}
                style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
              >
                -
              </button>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{config.count}</span>
              <button 
                type="button"
                onClick={() => handleStepper(config.id, "count", "inc", config.count)}
                style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
              >
                +
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '0.25rem' }}>
              <button 
                type="button"
                onClick={() => handleStepper(config.id, "marks", "dec", config.marks)}
                style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
              >
                -
              </button>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{config.marks}m</span>
              <button 
                type="button"
                onClick={() => handleStepper(config.id, "marks", "inc", config.marks)}
                style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}
              >
                +
              </button>
            </div>

            {data.questionConfigs.length > 1 ? (
              <button 
                type="button"
                onClick={() => removeQuestionConfig(config.id)}
                style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '4px' }}
                title="Remove Question Type"
              >
                ×
              </button>
            ) : <div style={{ width: '32px' }}></div>}
          </div>
        ))}
      </div>

      <button 
        type="button" 
        onClick={addQuestionConfig}
        style={{ 
          marginTop: '1rem',
          color: 'var(--primary-color)',
          fontWeight: 500,
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <span>+</span> Add Question Type
      </button>
    </div>
  );
}
