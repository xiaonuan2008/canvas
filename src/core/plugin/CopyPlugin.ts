import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';

export class CopyPlugin implements IPluginTempl {
  static pluginName = 'CopyPlugin';
  static events = [];
  static apis = ['copy', 'paste'];
  static hotkeys = ['ctrl+c', 'ctrl+v'];

  public canvas: fabric.Canvas;
  private clipboard: fabric.FabricObject | null = null;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {}
  destroy() {}

  async copy() {
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) return;
    this.clipboard = await activeObject.clone();
  }

  async paste() {
    if (!this.clipboard) return;
    const cloned = await this.clipboard.clone();
    cloned.set({
      left: (cloned.left || 0) + 20,
      top: (cloned.top || 0) + 20,
    });
    this.canvas.add(cloned);
    this.canvas.setActiveObject(cloned);
    this.canvas.renderAll();
  }
}
