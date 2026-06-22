import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';

export class CenterAlignPlugin implements IPluginTempl {
  static pluginName = 'CenterAlignPlugin';
  static events = [];
  static apis = ['centerH', 'centerV', 'center'];
  static hotkeys = [];

  public canvas: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {}
  destroy() {}

  centerH() {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    const canvasWidth = this.canvas.width || 800;
    activeObject.set('left', canvasWidth / 2 - (activeObject.width || 0) * (activeObject.scaleX || 1) / 2);
    this.canvas.renderAll();
  }

  centerV() {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    const canvasHeight = this.canvas.height || 600;
    activeObject.set('top', canvasHeight / 2 - (activeObject.height || 0) * (activeObject.scaleY || 1) / 2);
    this.canvas.renderAll();
  }

  center() {
    this.centerH();
    this.centerV();
  }
}
