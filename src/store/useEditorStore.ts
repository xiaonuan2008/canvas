import { create } from 'zustand';
import type { Canvas } from 'fabric';
import type { ToolType } from '../types';

interface EditorState {
  canvas: Canvas | null;
  activeTool: ToolType;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  setCanvas: (canvas: Canvas | null) => void;
  setActiveTool: (tool: ToolType) => void;
  setCanvasSize: (width: number, height: number) => void;
  setZoom: (zoom: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  canvas: null,
  activeTool: 'select',
  canvasWidth: 800,
  canvasHeight: 600,
  zoom: 1,
  setCanvas: (canvas) => set({ canvas }),
  setActiveTool: (activeTool) => set({ activeTool }),
  setCanvasSize: (canvasWidth, canvasHeight) => set({ canvasWidth, canvasHeight }),
  setZoom: (zoom) => set({ zoom }),
}));
