import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';

export class GroupAlignPlugin implements IPluginTempl {
  static pluginName = 'GroupAlignPlugin';
  static events = [];
  static apis = ['alignLeft', 'alignRight', 'alignTop', 'alignBottom', 'alignCenterH', 'alignCenterV'];
  static hotkeys = [];

  public canvas: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {}
  destroy() {}

  private getActiveObjects(): fabric.FabricObject[] {
    const active = this.canvas.getActiveObject();
    if (!active) return [];
    if (active.type === 'activeSelection') {
      return (active as fabric.ActiveSelection).getObjects();
    }
    return [active];
  }

  alignLeft() {
    const objects = this.getActiveObjects();
    if (objects.length < 2) return;
    const minLeft = Math.min(...objects.map((obj) => obj.left || 0));
    objects.forEach((obj) => obj.set('left', minLeft));
    this.canvas.renderAll();
  }

  alignRight() {
    const objects = this.getActiveObjects();
    if (objects.length < 2) return;
    const maxRight = Math.max(...objects.map((obj) => (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1)));
    objects.forEach((obj) => obj.set('left', maxRight - (obj.width || 0) * (obj.scaleX || 1)));
    this.canvas.renderAll();
  }

  alignTop() {
    const objects = this.getActiveObjects();
    if (objects.length < 2) return;
    const minTop = Math.min(...objects.map((obj) => obj.top || 0));
    objects.forEach((obj) => obj.set('top', minTop));
    this.canvas.renderAll();
  }

  alignBottom() {
    const objects = this.getActiveObjects();
    if (objects.length < 2) return;
    const maxBottom = Math.max(...objects.map((obj) => (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1)));
    objects.forEach((obj) => obj.set('top', maxBottom - (obj.height || 0) * (obj.scaleY || 1)));
    this.canvas.renderAll();
  }

  alignCenterH() {
    const objects = this.getActiveObjects();
    if (objects.length < 2) return;
    const centers = objects.map((obj) => (obj.left || 0) + (obj.width || 0) * (obj.scaleX || 1) / 2);
    const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
    objects.forEach((obj) => obj.set('left', avgCenter - (obj.width || 0) * (obj.scaleX || 1) / 2));
    this.canvas.renderAll();
  }

  alignCenterV() {
    const objects = this.getActiveObjects();
    if (objects.length < 2) return;
    const centers = objects.map((obj) => (obj.top || 0) + (obj.height || 0) * (obj.scaleY || 1) / 2);
    const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
    objects.forEach((obj) => obj.set('top', avgCenter - (obj.height || 0) * (obj.scaleY || 1) / 2));
    this.canvas.renderAll();
  }
}
