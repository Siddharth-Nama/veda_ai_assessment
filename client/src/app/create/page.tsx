"use client";

import React from "react";
import AssignmentForm from "@/components/features/AssignmentForm";
import router from "next/navigation";

export default function CreatePage() {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-dot"></div>
        <div>
          <h1 className="page-title">Create Assignment</h1>
          <p className="page-subtitle">Design a new assignment for your students.</p>
        </div>
      </div>

      <div className="create-form-container">
        <AssignmentForm />
      </div>
    </div>
  );
}
