import { create } from 'zustand';

type ToolState = {
  pageTool: string;
  setPageTool: (toolName: string) => void;
};

export const useToolStore = create<ToolState>((set) => ({
  pageTool: 'Home',
  setPageTool: (toolName) => set({ pageTool: toolName }),
}));
