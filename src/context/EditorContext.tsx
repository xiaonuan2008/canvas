import { createContext, useContext, useRef, useCallback } from 'react';
import type { Canvas } from 'fabric';

export interface EditorAPI {
  addText: () => void;
  addImage: (url: string) => void;
  addRect: () => void;
  addCircle: () => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  undo: () => void;
  redo: () => void;
  exportImage: (format?: 'png' | 'jpeg', quality?: number) => string | null;
  setBackground: (color: string) => void;
  getCanvas: () => Canvas | null;
  registerAPI: (api: EditorAPI) => void;
}

interface EditorContextValue {
  apiRef: React.RefObject<EditorAPI | null>;
  registerAPI: (api: EditorAPI) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const apiRef = useRef<EditorAPI | null>(null);

  const registerAPI = useCallback((api: EditorAPI) => {
    apiRef.current = api;
  }, []);

  return (
    <EditorContext.Provider value={{ apiRef, registerAPI }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorAPI(): EditorAPI {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditorAPI must be used within EditorProvider');

  return {
    addText: () => ctx.apiRef.current?.addText(),
    addImage: (url: string) => ctx.apiRef.current?.addImage(url),
    addRect: () => ctx.apiRef.current?.addRect(),
    addCircle: () => ctx.apiRef.current?.addCircle(),
    deleteSelected: () => ctx.apiRef.current?.deleteSelected(),
    duplicateSelected: () => ctx.apiRef.current?.duplicateSelected(),
    undo: () => ctx.apiRef.current?.undo(),
    redo: () => ctx.apiRef.current?.redo(),
    exportImage: (format, quality) => ctx.apiRef.current?.exportImage(format, quality) ?? null,
    setBackground: (color: string) => ctx.apiRef.current?.setBackground(color),
    getCanvas: () => ctx.apiRef.current?.getCanvas() ?? null,
    registerAPI: (api: EditorAPI) => ctx.apiRef.current?.registerAPI(api),
  };
}
