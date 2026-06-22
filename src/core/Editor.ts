import * as fabric from 'fabric';
import mitt from 'mitt';
import hotkeys from 'hotkeys-js';
import type { IPluginTempl, PluginClass } from './interface/Editor';

const emitter = mitt();

type EventType = string | symbol;
type EventHandler = (...args: any[]) => void;

export class Editor {
  public canvas: fabric.Canvas;
  private pluginMap: Map<string, IPluginTempl> = new Map();
  private customProperties: string[] = [];
  private contextMenu: any = null;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  // Event system
  on(event: EventType, handler: EventHandler) {
    emitter.on(event, handler);
  }

  off(event: EventType, handler: EventHandler) {
    emitter.off(event, handler);
  }

  emit(event: EventType, ...args: any[]) {
    emitter.emit(event, args);
  }

  // Plugin system
  use(Plugin: PluginClass<IPluginTempl>, options?: any) {
    if (this.pluginMap.has(Plugin.pluginName)) {
      console.warn(`Plugin ${Plugin.pluginName} already registered`);
      return this;
    }
    const plugin = new Plugin(this.canvas, this, options);
    this.pluginMap.set(Plugin.pluginName, plugin);
    plugin.init();
    return this;
  }

  getPlugin(name: string): IPluginTempl | undefined {
    return this.pluginMap.get(name);
  }

  // API proxy
  callApi(pluginName: string, apiName: string, ...args: any[]) {
    const plugin = this.pluginMap.get(pluginName);
    if (plugin && typeof (plugin as any)[apiName] === 'function') {
      return (plugin as any)[apiName](...args);
    }
    console.warn(`API ${apiName} not found in plugin ${pluginName}`);
  }

  // Hotkeys
  registerHotkey(keys: string, callback: (e: KeyboardEvent) => void) {
    hotkeys(keys, (e: any) => {
      e.preventDefault();
      callback(e);
    });
  }

  unregisterHotkey(keys: string) {
    hotkeys.unbind(keys);
  }

  // Custom properties
  registerCustomProperty(property: string) {
    if (!this.customProperties.includes(property)) {
      this.customProperties.push(property);
    }
  }

  getCustomProperties(): string[] {
    return [...this.customProperties];
  }

  // Context menu
  registerContextMenu(menuItems: any[]) {
    this.contextMenu = menuItems;
  }

  getContextMenu() {
    return this.contextMenu || [];
  }

  // Cleanup
  destroy() {
    this.pluginMap.forEach((plugin) => {
      if (typeof plugin.destroy === 'function') {
        plugin.destroy();
      }
    });
    this.pluginMap.clear();
    hotkeys.unbind();
  }
}
