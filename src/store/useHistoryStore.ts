import { create } from 'zustand';

interface HistoryState {
  past: string[];
  present: string | null;
  future: string[];
  maxHistory: number;
  pushState: (json: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  past: [],
  present: null,
  future: [],
  maxHistory: 50,
  pushState: (json) => set((state) => ({
    past: [...state.past.slice(-(state.maxHistory - 1)), state.present].filter(Boolean) as string[],
    present: json,
    future: [],
  })),
  undo: () => {
    const { past, present, future } = get();
    if (past.length === 0) return null;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    set({ past: newPast, present: previous, future: [present!, ...future].filter(Boolean) as string[] });
    return previous;
  },
  redo: () => {
    const { past, present, future } = get();
    if (future.length === 0) return null;
    const next = future[0];
    const newFuture = future.slice(1);
    set({ past: [...past, present!].filter(Boolean) as string[], present: next, future: newFuture });
    return next;
  },
  canUndo: () => get().past.length > 0,
  canRedo: () => get().future.length > 0,
  clear: () => set({ past: [], present: null, future: [] }),
}));
