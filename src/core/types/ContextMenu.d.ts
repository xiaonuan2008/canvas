declare class ContextMenu {
  constructor(container: HTMLElement, items: any[]);
  container: HTMLElement;
  dom: HTMLElement | null;
  shown: boolean;
  root: boolean;
  parent: ContextMenu | null;
  submenus: ContextMenu[];
  items: any[];
  getMenuDom(): HTMLElement;
  itemToDomEl(data: any): HTMLElement;
  hideAll(): void;
  hide(): void;
  hideSubMenus(): void;
  show(x: number, y: number): void;
  install(): void;
  setData(data: any[]): void;
  uninstall(): void;
}

export default ContextMenu;
