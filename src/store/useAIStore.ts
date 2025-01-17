import { create } from "zustand";

interface AIStore {
  thinking: boolean;
  setThinking: (thinking: boolean) => void;
}

export const useAIStore = create<AIStore>((set) => ({
  thinking: false,
  setThinking: (thinking: boolean) => {
    set({ thinking });
    console.log("AI thinking state:", thinking);
  },
}));