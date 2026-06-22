import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';

export class HistoryPlugin implements IPluginTempl {
  static pluginName = 'HistoryPlugin';
  static events = ['history:undo', 'history:redo', 'history:clear'];
  static apis = ['undo', 'redo', 'clearHistory', 'canUndo', 'canRedo'];
  static hotkeys = ['ctrl+z', 'ctrl+shift+z', 'ctrl+y'];

  public canvas: fabric.Canvas;
  private history: string[] = [];
  private historyIndex = -1;
  private maxHistory = 50;
  private isProcessing = false;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {
    this.saveState();
    this.bindEvents();
  }

  bindEvents() {
    const saveHandler = () => {
      if (this.isProcessing) return;
      clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => this.saveState(), 100);
    };

    this.canvas.on('object:modified', saveHandler);
    this.canvas.on('object:added', saveHandler);
    this.canvas.on('object:removed', saveHandler);
  }

  private saveTimer: ReturnType<typeof setTimeout> | undefined = undefined;

  saveState() {
    if (this.isProcessing) return;
    const json = JSON.stringify(this.canvas.toJSON());
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push(json);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  undo() {
    if (this.historyIndex <= 0) return;
    this.isProcessing = true;
    this.historyIndex--;
    const json = this.history[this.historyIndex];
    this.canvas.loadFromJSON(JSON.parse(json), () => {
      this.canvas.renderAll();
      this.isProcessing = false;
    });
  }

  redo() {
    if (this.historyIndex >= this.history.length - 1) return;
    this.isProcessing = true;
    this.historyIndex++;
    const json = this.history[this.historyIndex];
    this.canvas.loadFromJSON(JSON.parse(json), () => {
      this.canvas.renderAll();
      this.isProcessing = false;
    });
  }

  clearHistory() {
    this.history = [];
    this.historyIndex = -1;
    this.saveState();
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  destroy() {
    this.canvas.off('object:modified');
    this.canvas.off('object:added');
    this.canvas.off('object:removed');
  }
}
