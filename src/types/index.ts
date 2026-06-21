import type { Canvas, FabricObject } from 'fabric';

export interface EditorState {
  canvas: Canvas | null;
  activeTool: ToolType;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
}

export type ToolType = 'select' | 'text' | 'image' | 'rect' | 'circle' | 'line' | 'arrow' | 'hand';

export interface CanvasObject {
  id: string;
  type: string;
  name: string;
  visible: boolean;
  locked: boolean;
  fabricObject?: FabricObject;
}

export interface HistoryEntry {
  json: string;
  timestamp: number;
}
