import { useEffect, useRef } from 'react';
import type { Canvas, FabricObject } from 'fabric';

interface AlignLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const SNAP_THRESHOLD = 6; // 吸附像素阈值
const GUIDELINE_COLOR = '#58a6ff';
const GUIDELINE_WIDTH = 1;

export function useAligningGuidelines(canvas: Canvas | null) {
  const linesRef = useRef<AlignLine[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvas) return;

    const ctx = canvas.getContext();
    ctxRef.current = ctx;

    // Store original render
    const originalRender = canvas.renderAll.bind(canvas);

    const drawGuidelines = () => {
      if (linesRef.current.length === 0) return;

      ctx.save();
      ctx.strokeStyle = GUIDELINE_COLOR;
      ctx.lineWidth = GUIDELINE_WIDTH;
      ctx.setLineDash([4, 4]);

      linesRef.current.forEach((line) => {
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.stroke();
      });

      ctx.restore();
    };

    // Override render to include guidelines
    canvas.renderAll = function () {
      originalRender();
      drawGuidelines();
    };

    const handleObjectMoving = (e: any) => {
      const activeObject = e.target as FabricObject;
      if (!activeObject) return;

      const objects = canvas
        .getObjects()
        .filter((obj: FabricObject) => obj !== activeObject && obj.visible);
      const lines: AlignLine[] = [];
      const snapX: number[] = [];
      const snapY: number[] = [];

      const activeBounds = activeObject.getBoundingRect();
      const activeCenterX = activeBounds.left + activeBounds.width / 2;
      const activeCenterY = activeBounds.top + activeBounds.height / 2;
      const activeLeft = activeBounds.left;
      const activeRight = activeBounds.left + activeBounds.width;
      const activeTop = activeBounds.top;
      const activeBottom = activeBounds.top + activeBounds.height;

      objects.forEach((obj: FabricObject) => {
        const bounds = obj.getBoundingRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        const left = bounds.left;
        const right = bounds.left + bounds.width;
        const top = bounds.top;
        const bottom = bounds.top + bounds.height;

        // Horizontal alignments
        const hChecks = [
          { active: activeLeft, target: left, axis: 'x' },
          { active: activeLeft, target: centerX, axis: 'x' },
          { active: activeLeft, target: right, axis: 'x' },
          { active: activeCenterX, target: left, axis: 'x' },
          { active: activeCenterX, target: centerX, axis: 'x' },
          { active: activeCenterX, target: right, axis: 'x' },
          { active: activeRight, target: left, axis: 'x' },
          { active: activeRight, target: centerX, axis: 'x' },
          { active: activeRight, target: right, axis: 'x' },
        ];

        hChecks.forEach(({ active, target }) => {
          if (Math.abs(active - target) < SNAP_THRESHOLD) {
            snapX.push(target - (active - activeObject.left));
            lines.push({
              x1: target,
              y1: Math.min(activeBounds.top, bounds.top) - 20,
              x2: target,
              y2: Math.max(activeBounds.top + activeBounds.height, bounds.top + bounds.height) + 20,
            });
          }
        });

        // Vertical alignments
        const vChecks = [
          { active: activeTop, target: top, axis: 'y' },
          { active: activeTop, target: centerY, axis: 'y' },
          { active: activeTop, target: bottom, axis: 'y' },
          { active: activeCenterY, target: top, axis: 'y' },
          { active: activeCenterY, target: centerY, axis: 'y' },
          { active: activeCenterY, target: bottom, axis: 'y' },
          { active: activeBottom, target: top, axis: 'y' },
          { active: activeBottom, target: centerY, axis: 'y' },
          { active: activeBottom, target: bottom, axis: 'y' },
        ];

        vChecks.forEach(({ active, target }) => {
          if (Math.abs(active - target) < SNAP_THRESHOLD) {
            snapY.push(target - (active - activeObject.top));
            lines.push({
              x1: Math.min(activeBounds.left, bounds.left) - 20,
              y1: target,
              x2: Math.max(activeBounds.left + activeBounds.width, bounds.left + bounds.width) + 20,
              y2: target,
            });
          }
        });
      });

      // Canvas center lines
      const canvasWidth = canvas.width || 800;
      const canvasHeight = canvas.height || 600;
      const canvasCenterX = canvasWidth / 2;
      const canvasCenterY = canvasHeight / 2;

      if (Math.abs(activeCenterX - canvasCenterX) < SNAP_THRESHOLD) {
        snapX.push(canvasCenterX - activeBounds.width / 2);
        lines.push({
          x1: canvasCenterX,
          y1: 0,
          x2: canvasCenterX,
          y2: canvasHeight,
        });
      }
      if (Math.abs(activeCenterY - canvasCenterY) < SNAP_THRESHOLD) {
        snapY.push(canvasCenterY - activeBounds.height / 2);
        lines.push({
          x1: 0,
          y1: canvasCenterY,
          x2: canvasWidth,
          y2: canvasCenterY,
        });
      }

      // Apply snap
      if (snapX.length > 0) {
        activeObject.set('left', snapX[0]);
      }
      if (snapY.length > 0) {
        activeObject.set('top', snapY[0]);
      }

      linesRef.current = lines;
      canvas.renderAll();
    };

    const handleObjectModified = () => {
      linesRef.current = [];
      canvas.renderAll();
    };

    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:cleared', handleObjectModified);

    return () => {
      canvas.off('object:moving', handleObjectMoving);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:cleared', handleObjectModified);
      canvas.renderAll = originalRender;
    };
  }, [canvas]);
}
