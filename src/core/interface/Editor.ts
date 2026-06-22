import * as fabric from 'fabric';

export type IEditor = fabric.Canvas;

export interface EditorInterface {
  canvas: fabric.Canvas;
}

export interface IPluginTempl {
  pluginName?: string;
  events?: string[];
  apis?: string[];
  hotkeys?: string[];
  init: () => void;
  destroy: () => void;
}

export interface PluginClass<T> {
  new (canvas: fabric.Canvas, editor: any, options?: any): T;
  pluginName: string;
  events: string[];
  apis: string[];
  hotkeys: string[];
}
