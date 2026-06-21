import { create } from 'zustand';
import type { CanvasObject } from '../types';

interface CanvasState {
  objects: CanvasObject[];
  selectedObjectId: string | null;
  setObjects: (objects: CanvasObject[]) => void;
  addObject: (obj: CanvasObject) => void;
  removeObject: (id: string) => void;
  updateObject: (id: string, updates: Partial<CanvasObject>) => void;
  setSelectedObjectId: (id: string | null) => void;
  reorderObjects: (objects: CanvasObject[]) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  objects: [],
  selectedObjectId: null,
  setObjects: (objects) => set({ objects }),
  addObject: (obj) => set((state) => ({ objects: [...state.objects, obj] })),
  removeObject: (id) => set((state) => ({
    objects: state.objects.filter((o) => o.id !== id),
    selectedObjectId: state.selectedObjectId === id ? null : state.selectedObjectId,
  })),
  updateObject: (id, updates) => set((state) => ({
    objects: state.objects.map((o) => (o.id === id ? { ...o, ...updates } : o)),
  })),
  setSelectedObjectId: (selectedObjectId) => set({ selectedObjectId }),
  reorderObjects: (objects) => set({ objects }),
}));
