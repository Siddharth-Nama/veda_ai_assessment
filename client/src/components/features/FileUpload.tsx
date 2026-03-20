import React, { useRef, useState } from "react";
import { useAssignmentStore } from "@/store/assignmentStore";

export default function FileUpload() {
  const { data, updateField } = useAssignmentStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateField("fileContent", result);
      updateField("fileName", file.name);
    };
    
    if (file.type.includes("pdf") || file.type.includes("image")) {
       updateField("fileName", `${file.name} (Requires backend text extraction)`);
       updateField("fileContent", "Sample text extracted from file for AI context.");
    } else {
      reader.readAsText(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsHovering(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      const event = new Event('change', { bubbles: true });
      fileInputRef.current.dispatchEvent(event);
    }
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <label className="label-text">Select Document</label>
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isHovering ? 'var(--primary-color)' : 'var(--border-color)'}`,
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isHovering ? 'rgba(0, 112, 243, 0.05)' : 'transparent',
          transition: 'all 0.2s ease'
        }}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".txt,.pdf,.png,.jpg,.jpeg"
        />
        
        {data.fileName ? (
          <div>
            <p style={{ fontWeight: 500, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
              {data.fileName}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Click or drag to replace
            </p>
          </div>
        ) : (
          <div>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: '#F3F4F6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              color: 'var(--text-secondary)'
            }}>
              📁
            </div>
            <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>
              DRAG OR BROWSE
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Only files below 2mb are processed over HTTPS
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
