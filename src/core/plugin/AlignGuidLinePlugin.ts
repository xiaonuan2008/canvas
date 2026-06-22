import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';

interface Guideline {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class AlignGuidLinePlugin implements IPluginTempl {
  static pluginName = 'AlignGuidLinePlugin';
  static events = [];
  static apis = ['enable', 'disable'];
  static hotkeys = [];

  public canvas: fabric.Canvas;
  private enabled = true;
  private snapThreshold = 6;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {
    this.canvas.on('object:moving', this.handleMoving.bind(this));
    this.canvas.on('object:modified', this.clearGuidelines.bind(this));
    this.canvas.on('selection:cleared', this.clearGuidelines.bind(this));
  }

  handleMoving(opt: any) {
    if (!this.enabled) return;
    const activeObject = opt.target as fabric.FabricObject;
    if (!activeObject) return;

    const objects = this.canvas.getObjects().filter((obj) => obj !== activeObject && obj.visible);
    const lines: Guideline[] = [];
    const activeBounds = activeObject.getBoundingRect();
    const activeCenterX = activeBounds.left + activeBounds.width / 2;
    const activeCenterY = activeBounds.top + activeBounds.height / 2;
    const activeLeft = activeBounds.left;
    const activeRight = activeBounds.left + activeBounds.width;
    const activeTop = activeBounds.top;
    const activeBottom = activeBounds.top + activeBounds.height;

    objects.forEach((obj) => {
      const bounds = obj.getBoundingRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      const left = bounds.left;
      const right = bounds.left + bounds.width;
      const top = bounds.top;
      const bottom = bounds.top + bounds.height;

      // Horizontal alignments
      const hChecks = [
        { active: activeLeft, target: left },
        { active: activeLeft, target: centerX },
        { active: activeLeft, target: right },
        { active: activeCenterX, target: left },
        { active: activeCenterX, target: centerX },
        { active: activeCenterX, target: right },
        { active: activeRight, target: left },
        { active: activeRight, target: centerX },
        { active: activeRight, target: right },
      ];

      hChecks.forEach(({ active, target }) => {
        if (Math.abs(active - target) < this.snapThreshold) {
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
        { active: activeTop, target: top },
        { active: activeTop, target: centerY },
        { active: activeTop, target: bottom },
        { active: activeCenterY, target: top },
        { active: activeCenterY, target: centerY },
        { active: activeCenterY, target: bottom },
        { active: activeBottom, target: top },
        { active: activeBottom, target: centerY },
        { active: activeBottom, target: bottom },
      ];

      vChecks.forEach(({ active, target }) => {
        if (Math.abs(active - target) < this.snapThreshold) {
          lines.push({
            x1: Math.min(activeBounds.left, bounds.left) - 20,
            y1: target,
            x2: Math.max(activeBounds.left + activeBounds.width, bounds.left + bounds.width) + 20,
            y2: target,
          });
        }
      });
    });

    // Store guidelines for rendering (if needed in future)
    void lines;
    this.canvas.renderAll();
  }

  clearGuidelines() {
    this.canvas.renderAll();
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
    this.clearGuidelines();
  }

  destroy() {
    this.canvas.off('object:moving');
    this.canvas.off('object:modified');
    this.canvas.off('selection:cleared');
  }
}
