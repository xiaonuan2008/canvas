import { useRef, forwardRef, useImperativeHandle } from 'react';
import { useCanvas } from '../hooks/useCanvas';
import { useEditorStore } from '../store/useEditorStore';
import { useAligningGuidelines } from '../hooks/useAligningGuidelines';
import type { EditorAPI } from '../context/EditorContext';

export const CanvasEditor = forwardRef<EditorAPI>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { addText, addImage, addRect, addCircle, deleteSelected, duplicateSelected, undo, redo, exportImage, setBackground, getCanvas } = useCanvas(canvasRef);
  const { canvas, zoom } = useEditorStore();

  useImperativeHandle(ref, () => ({
    addText, addImage, addRect, addCircle,
    deleteSelected, duplicateSelected, undo, redo, exportImage, setBackground, getCanvas,
    registerAPI: () => {}, // no-op, handled by parent
  }));

  useAligningGuidelines(canvas);

  return (
    <div className="flex-1 flex items-center justify-center bg-bg-primary canvas-grid overflow-auto">
      <div
        className="shadow-lg"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
});

CanvasEditor.displayName = 'CanvasEditor';
