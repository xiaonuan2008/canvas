import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';

export class AddBaseTypePlugin implements IPluginTempl {
  static pluginName = 'AddBaseTypePlugin';
  static events = [];
  static apis = ['addText', 'addRect', 'addCircle', 'addTriangle', 'addPolygon'];
  static hotkeys = [];

  public canvas: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {}
  destroy() {}

  addText(text: string, options: any = {}) {
    const textObj = new fabric.Textbox(text || '双击编辑', {
      left: 100,
      top: 100,
      width: 200,
      fontSize: 24,
      fill: '#1e293b',
      fontFamily: 'Noto Sans SC, system-ui, sans-serif',
      editable: true,
      ...options,
    } as any);
    this.canvas.add(textObj);
    this.canvas.setActiveObject(textObj);
    this.canvas.renderAll();
    return textObj;
  }

  addRect(options: any = {}) {
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      width: 150,
      height: 100,
      fill: '#6366f1',
      rx: 8,
      ry: 8,
      ...options,
    } as any);
    this.canvas.add(rect);
    this.canvas.setActiveObject(rect);
    this.canvas.renderAll();
    return rect;
  }

  addCircle(options: any = {}) {
    const circle = new fabric.Circle({
      left: 100,
      top: 100,
      radius: 50,
      fill: '#f59e0b',
      ...options,
    } as any);
    this.canvas.add(circle);
    this.canvas.setActiveObject(circle);
    this.canvas.renderAll();
    return circle;
  }

  addTriangle(options: any = {}) {
    const triangle = new fabric.Triangle({
      left: 100,
      top: 100,
      width: 100,
      height: 100,
      fill: '#10b981',
      ...options,
    } as any);
    this.canvas.add(triangle);
    this.canvas.setActiveObject(triangle);
    this.canvas.renderAll();
    return triangle;
  }

  addPolygon(points: { x: number; y: number }[], options: any = {}) {
    const polygon = new fabric.Polygon(points, {
      left: 100,
      top: 100,
      fill: '#8b5cf6',
      ...options,
    } as any);
    this.canvas.add(polygon);
    this.canvas.setActiveObject(polygon);
    this.canvas.renderAll();
    return polygon;
  }
}
