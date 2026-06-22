import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';

export class DeleteHotKeyPlugin implements IPluginTempl {
  static pluginName = 'DeleteHotKeyPlugin';
  static events = [];
  static apis = ['deleteSelected'];
  static hotkeys = ['delete', 'backspace'];

  public canvas: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {}
  destroy() {}

  deleteSelected() {
    const activeObjects = this.canvas.getActiveObjects();
    if (activeObjects.length > 0) {
      activeObjects.forEach((obj) => this.canvas.remove(obj));
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
    }
  }
}
