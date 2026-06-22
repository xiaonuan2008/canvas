import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';

export class DrawPolygonPlugin implements IPluginTempl {
  static pluginName = 'DrawPolygonPlugin';
  static events = [];
  static apis = ['startDrawPolygon', 'endDrawPolygon'];
  static hotkeys = [];

  public canvas: fabric.Canvas;
  private isDrawing = false;
  private points: { x: number; y: number }[] = [];
  private polygon: fabric.Polygon | null = null;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {
    this.canvas.on('mouse:down', this.handleMouseDown.bind(this));
    this.canvas.on('mouse:move', this.handleMouseMove.bind(this));
    this.canvas.on('mouse:dblclick', this.handleDoubleClick.bind(this));
  }

  handleMouseDown(opt: any) {
    if (!this.isDrawing) return;
    const pointer = (this.canvas as any).getPointer(opt.e);
    this.points.push({ x: pointer.x, y: pointer.y });
    this.updatePolygon();
  }

  handleMouseMove(opt: any) {
    if (!this.isDrawing || this.points.length === 0) return;
    const pointer = (this.canvas as any).getPointer(opt.e);
    this.updatePolygon(pointer);
  }

  handleDoubleClick() {
    if (!this.isDrawing || this.points.length < 3) return;
    this.endDrawPolygon();
  }

  updatePolygon(currentPointer?: { x: number; y: number }) {
    const pts = currentPointer ? [...this.points, currentPointer] : this.points;
    if (this.polygon) {
      this.canvas.remove(this.polygon);
    }
    this.polygon = new fabric.Polygon(pts, {
      fill: 'rgba(99, 102, 241, 0.2)',
      stroke: '#6366f1',
      strokeWidth: 2,
      selectable: true,
    } as any);
    this.canvas.add(this.polygon);
    this.canvas.renderAll();
  }

  startDrawPolygon() {
    this.isDrawing = true;
    this.points = [];
    this.canvas.selection = false;
  }

  endDrawPolygon() {
    this.isDrawing = false;
    this.points = [];
    this.polygon = null;
    this.canvas.selection = true;
  }

  destroy() {
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.canvas.off('mouse:dblclick');
  }
}
