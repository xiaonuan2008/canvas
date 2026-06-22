import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';

export class LayerPlugin implements IPluginTempl {
  static pluginName = 'LayerPlugin';
  static events = [];
  static apis = ['bringForward', 'sendBackwards', 'bringToFront', 'sendToBack'];
  static hotkeys = [];

  public canvas: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {}
  destroy() {}

  bringForward() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      (activeObject as any).bringForward?.();
      this.canvas.renderAll();
    }
  }

  sendBackwards() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      (activeObject as any).sendBackwards?.();
      this.canvas.renderAll();
    }
  }

  bringToFront() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      (activeObject as any).bringToFront?.();
      this.canvas.renderAll();
    }
  }

  sendToBack() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      (activeObject as any).sendToBack?.();
      this.canvas.renderAll();
    }
  }
}
