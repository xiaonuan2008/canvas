import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';

export class DrawLinePlugin implements IPluginTempl {
  static pluginName = 'DrawLinePlugin';
  static events = [];
  static apis = ['startDrawLine', 'endDrawLine'];
  static hotkeys = [];

  public canvas: fabric.Canvas;
  private isDrawing = false;
  private line: fabric.Line | null = null;
  private startPoint: { x: number; y: number } | null = null;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {
    this.canvas.on('mouse:down', this.handleMouseDown.bind(this));
    this.canvas.on('mouse:move', this.handleMouseMove.bind(this));
    this.canvas.on('mouse:up', this.handleMouseUp.bind(this));
  }

  handleMouseDown(opt: any) {
    if (!this.isDrawing) return;
    const pointer = (this.canvas as any).getPointer(opt.e);
    this.startPoint = { x: pointer.x, y: pointer.y };
    this.line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
      stroke: '#1e293b',
      strokeWidth: 2,
      selectable: true,
    } as any);
    this.canvas.add(this.line);
  }

  handleMouseMove(opt: any) {
    if (!this.isDrawing || !this.line || !this.startPoint) return;
    const pointer = (this.canvas as any).getPointer(opt.e);
    this.line.set({
      x2: pointer.x,
      y2: pointer.y,
    });
    this.canvas.renderAll();
  }

  handleMouseUp() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.line = null;
    this.startPoint = null;
    this.canvas.selection = true;
  }

  startDrawLine() {
    this.isDrawing = true;
    this.canvas.selection = false;
  }

  endDrawLine() {
    this.isDrawing = false;
    this.canvas.selection = true;
  }

  destroy() {
    this.canvas.off('mouse:down');
    this.canvas.off('mouse:move');
    this.canvas.off('mouse:up');
  }
}
