import { create } from "zustand";
import { Task, AIState, TaskStatus } from "../types/ai";

interface AIStore extends AIState {
  addTask: (description: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus, result?: string) => void;
  setThinking: (thinking: boolean) => void;
  updateContext: (context: string) => void;
}

export const useAIStore = create<AIStore>((set) => ({
  tasks: [],
  thinking: false,
  context: "",
  
  addTask: (description: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substring(7),
      description,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      tasks: [newTask, ...state.tasks],
      currentTask: state.currentTask || newTask,
    }));
    
    console.log("New task added:", newTask);
  },
  
  updateTaskStatus: (id: string, status: TaskStatus, result?: string) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? { ...task, status, result, updatedAt: new Date() }
          : task
      ),
    }));
    
    console.log("Task status updated:", { id, status, result });
  },
  
  setThinking: (thinking: boolean) => {
    set({ thinking });
    console.log("AI thinking state:", thinking);
  },
  
  updateContext: (context: string) => {
    set({ context });
    console.log("Context updated:", context);
  },
}));