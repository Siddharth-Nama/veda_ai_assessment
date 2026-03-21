import { create } from 'zustand';
import { AssignmentData, QuestionConfig } from '@/types';

interface AssignmentState {
  data: AssignmentData;
  updateField: <K extends keyof AssignmentData>(field: K, value: AssignmentData[K]) => void;
  addQuestionConfig: () => void;
  updateQuestionConfig: (id: string, field: keyof QuestionConfig, value: string | number) => void;
  removeQuestionConfig: (id: string) => void;
  resetForm: () => void;
}

const initialData: AssignmentData = {
  title: "",
  subject: "",
  classLevel: "",
  section: "",
  dueDate: "",
  questionConfigs: [{ id: "temp-1", type: "Multiple Choice Questions", count: 1, marks: 1 }],
  additionalInstructions: "",
  fileContent: "",
  fileName: "",
};

export const useAssignmentStore = create<AssignmentState>((set) => ({
  data: initialData,
  
  updateField: (field, value) => 
    set((state) => ({ data: { ...state.data, [field]: value } })),
    
  addQuestionConfig: () => 
    set((state) => ({
      data: {
        ...state.data,
        questionConfigs: [
          ...state.data.questionConfigs,
          { id: Math.random().toString(36).substr(2, 9), type: "Short Questions", count: 1, marks: 1 }
        ]
      }
    })),
    
  updateQuestionConfig: (id, field, value) =>
    set((state) => ({
      data: {
        ...state.data,
        questionConfigs: state.data.questionConfigs.map((config) => 
          config.id === id ? { ...config, [field]: value } : config
        )
      }
    })),
    
  removeQuestionConfig: (id) =>
    set((state) => ({
      data: {
        ...state.data,
        questionConfigs: state.data.questionConfigs.filter((config) => config.id !== id)
      }
    })),
    
  resetForm: () => set({ data: initialData }),
}));
