import * as fabric from 'fabric';

export function isText(obj: fabric.FabricObject): boolean {
  return obj.type === 'text' || obj.type === 'i-text' || obj.type === 'textbox';
}

export function isGroup(obj: fabric.FabricObject): boolean {
  return obj.type === 'group' || obj.type === 'activeSelection';
}

export function isActiveSelection(obj: fabric.FabricObject): boolean {
  return obj.type === 'activeSelection';
}
