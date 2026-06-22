import * as fabric from 'fabric';
import type { IPluginTempl } from '../interface/Editor';
import { DefaultConfig } from '../config';

export class WorkspacePlugin implements IPluginTempl {
  static pluginName = 'WorkspacePlugin';
  static events = [];
  static apis = ['getWorkspace', 'setWorkspace', 'auto'];
  static hotkeys = [];

  public canvas: fabric.Canvas;
  public workspace: fabric.Rect | null = null;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  init() {
    this.initWorkspace();
    this.bindEvents();
  }

  initWorkspace() {
    const workspace = new fabric.Rect({
      width: DefaultConfig.workspaceWidth,
      height: DefaultConfig.workspaceHeight,
      fill: DefaultConfig.workspaceColor,
      stroke: DefaultConfig.workspaceBorderColor,
      strokeWidth: 1,
      selectable: false,
      hoverCursor: 'default',
      id: 'workspace',
    } as any);

    this.workspace = workspace;
    this.canvas.add(workspace);
    this.canvas.sendObjectToBack(workspace);
    this.auto();
  }

  bindEvents() {
    this.canvas.on('mouse:wheel', (opt) => {
      const e = opt.e as WheelEvent;
      e.preventDefault();
      const delta = e.deltaY;
      let zoom = this.canvas.getZoom();
      zoom *= 0.999 ** delta;
      zoom = Math.max(0.1, Math.min(5, zoom));
      const point = new fabric.Point(e.offsetX, e.offsetY);
      this.canvas.zoomToPoint(point, zoom);
    });

    this.canvas.on('object:moving', (opt) => {
      const target = opt.target;
      if (!target || (target as any).id === 'workspace') return;
      const ws = this.workspace;
      if (!ws) return;
      const bounds = target.getBoundingRect();
      const wsBounds = ws.getBoundingRect();

      if (bounds.left < wsBounds.left) target.set('left', wsBounds.left + bounds.width / 2);
      if (bounds.top < wsBounds.top) target.set('top', wsBounds.top + bounds.height / 2);
      if (bounds.left + bounds.width > wsBounds.left + wsBounds.width) {
        target.set('left', wsBounds.left + wsBounds.width - bounds.width / 2);
      }
      if (bounds.top + bounds.height > wsBounds.top + wsBounds.height) {
        target.set('top', wsBounds.top + wsBounds.height - bounds.height / 2);
      }
    });
  }

  getWorkspace() {
    return this.workspace;
  }

  setWorkspace(options: Partial<fabric.Rect>) {
    if (this.workspace) {
      this.workspace.set(options);
      this.canvas.renderAll();
    }
  }

  auto() {
    if (!this.workspace) return;
    const { width, height } = this.canvas;
    const wsWidth = this.workspace.width || DefaultConfig.workspaceWidth;
    const wsHeight = this.workspace.height || DefaultConfig.workspaceHeight;
    const scale = Math.min((width || 800) / wsWidth, (height || 600) / wsHeight) * 0.9;
    const zoom = Math.max(0.1, Math.min(scale, 1));
    this.canvas.setZoom(zoom);
    const vpCenter = this.canvas.getVpCenter();
    const wsCenter = { x: wsWidth / 2, y: wsHeight / 2 };
    this.canvas.relativePan(new fabric.Point(
      (vpCenter.x - wsCenter.x * zoom),
      (vpCenter.y - wsCenter.y * zoom)
    ));
  }

  destroy() {
    this.canvas.off('mouse:wheel');
    this.canvas.off('object:moving');
  }
}
