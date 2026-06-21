import { useEffect, useRef, useCallback } from 'react';
import * as fabric from 'fabric';
import { useEditorStore } from '../store/useEditorStore';
import { useHistoryStore } from '../store/useHistoryStore';
import { useCanvasStore } from '../store/useCanvasStore';
import { generateId } from '../utils/id';

export function useCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const { setCanvas, canvasWidth, canvasHeight } = useEditorStore();
  const { pushState } = useHistoryStore();
  const { setSelectedObjectId, addObject, removeObject } = useCanvasStore();
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const fc = new fabric.Canvas(canvasRef.current, {
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricCanvasRef.current = fc;
    setCanvas(fc);

    // 初始状态保存
    const initialJson = JSON.stringify(fc.toJSON());
    pushState(initialJson);

    // 选中事件
    fc.on('selection:created', (e) => {
      const target = e.selected?.[0];
      if (target) {
        setSelectedObjectId((target as any).customId || null);
      }
    });

    fc.on('selection:updated', (e) => {
      const target = e.selected?.[0];
      if (target) {
        setSelectedObjectId((target as any).customId || null);
      }
    });

    fc.on('selection:cleared', () => {
      setSelectedObjectId(null);
    });

    // 修改后保存历史
    let saveTimer: ReturnType<typeof setTimeout>;
    fc.on('object:modified', () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        const json = JSON.stringify(fc.toJSON());
        pushState(json);
      }, 300);
    });

    return () => {
      clearTimeout(saveTimer);
      fc.dispose();
      setCanvas(null);
    };
  }, []);

  // 更新画布尺寸
  useEffect(() => {
    const fc = fabricCanvasRef.current;
    if (fc) {
      fc.setDimensions({ width: canvasWidth, height: canvasHeight });
      fc.renderAll();
    }
  }, [canvasWidth, canvasHeight]);

  const addText = useCallback(() => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    const text = new fabric.Textbox('双击编辑文字', {
      left: canvasWidth / 2 - 100,
      top: canvasHeight / 2 - 20,
      width: 200,
      fontSize: 24,
      fill: '#1e293b',
      fontFamily: 'Noto Sans SC, system-ui, sans-serif',
      editable: true,
      customId: generateId(),
      lineHeight: 1.2,
      charSpacing: 0,
      textAlign: 'left',
      fontWeight: 'normal',
      fontStyle: 'normal',
      underline: false,
    } as any);

    fc.add(text);
    fc.setActiveObject(text);
    fc.renderAll();

    addObject({
      id: (text as any).customId,
      type: 'text',
      name: '文字',
      visible: true,
      locked: false,
    });

    const json = JSON.stringify(fc.toJSON());
    pushState(json);
  }, [canvasWidth, canvasHeight]);

  const addImage = useCallback((url: string) => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    fabric.FabricImage.fromURL(url, { crossOrigin: 'anonymous' }).then((img) => {
      // Scale to fit canvas
      const maxW = canvasWidth * 0.6;
      const maxH = canvasHeight * 0.6;
      const scale = Math.min(maxW / (img.width || 1), maxH / (img.height || 1), 1);
      img.set({
        left: (canvasWidth - (img.width || 0) * scale) / 2,
        top: (canvasHeight - (img.height || 0) * scale) / 2,
        scaleX: scale,
        scaleY: scale,
        customId: generateId(),
      } as any);
      fc.add(img);
      fc.setActiveObject(img);
      fc.renderAll();

      addObject({
        id: (img as any).customId,
        type: 'image',
        name: '图片',
        visible: true,
        locked: false,
      });

      const json = JSON.stringify(fc.toJSON());
      pushState(json);
    });
  }, [canvasWidth, canvasHeight]);

  const addRect = useCallback(() => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    const rect = new fabric.Rect({
      left: canvasWidth / 2 - 75,
      top: canvasHeight / 2 - 50,
      width: 150,
      height: 100,
      fill: '#6366f1',
      rx: 8,
      ry: 8,
      customId: generateId(),
    } as any);

    fc.add(rect);
    fc.setActiveObject(rect);
    fc.renderAll();

    addObject({
      id: (rect as any).customId,
      type: 'rect',
      name: '矩形',
      visible: true,
      locked: false,
    });

    const json = JSON.stringify(fc.toJSON());
    pushState(json);
  }, [canvasWidth, canvasHeight]);

  const addCircle = useCallback(() => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    const circle = new fabric.Circle({
      left: canvasWidth / 2 - 50,
      top: canvasHeight / 2 - 50,
      radius: 50,
      fill: '#f59e0b',
      customId: generateId(),
    } as any);

    fc.add(circle);
    fc.setActiveObject(circle);
    fc.renderAll();

    addObject({
      id: (circle as any).customId,
      type: 'circle',
      name: '圆形',
      visible: true,
      locked: false,
    });

    const json = JSON.stringify(fc.toJSON());
    pushState(json);
  }, [canvasWidth, canvasHeight]);

  const deleteSelected = useCallback(() => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    const active = fc.getActiveObjects();
    if (active.length > 0) {
      active.forEach((obj) => fc.remove(obj));
      active.forEach((obj: any) => {
        if (obj.customId) removeObject(obj.customId);
      });
      fc.discardActiveObject();
      fc.renderAll();

      const json = JSON.stringify(fc.toJSON());
      pushState(json);
    }
  }, []);

  const duplicateSelected = useCallback(() => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    const active = fc.getActiveObject();
    if (!active) return;

    active.clone().then((cloned) => {
      cloned.set({
        left: (cloned.left || 0) + 20,
        top: (cloned.top || 0) + 20,
        customId: generateId(),
      } as any);
      fc.add(cloned);
      fc.setActiveObject(cloned);
      fc.renderAll();

      const json = JSON.stringify(fc.toJSON());
      pushState(json);
    });
  }, []);

  const undo = useCallback(() => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;
    const json = useHistoryStore.getState().undo();
    if (json) {
      fc.loadFromJSON(JSON.parse(json), () => {
        fc.renderAll();
      });
    }
  }, []);

  const redo = useCallback(() => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;
    const json = useHistoryStore.getState().redo();
    if (json) {
      fc.loadFromJSON(JSON.parse(json), () => {
        fc.renderAll();
      });
    }
  }, []);

  const setBackground = useCallback((color: string) => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;
    fc.set('backgroundColor', color);
    fc.renderAll();
    const json = JSON.stringify(fc.toJSON());
    pushState(json);
  }, []);

  const exportImage = useCallback((format: 'png' | 'jpeg' = 'png', quality = 1): string | null => {
    const fc = fabricCanvasRef.current;
    if (!fc) return null;

    const dataURL = fc.toDataURL({
      format,
      quality,
      multiplier: 2,
    });
    return dataURL;
  }, []);

  const getCanvas = useCallback(() => fabricCanvasRef.current, []);

  return {
    fabricCanvas: fabricCanvasRef,
    addText,
    addImage,
    addRect,
    addCircle,
    deleteSelected,
    duplicateSelected,
    undo,
    redo,
    setBackground,
    exportImage,
    getCanvas,
  };
}
