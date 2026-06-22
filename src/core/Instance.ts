import { Editor } from './Editor';
import * as fabric from 'fabric';

let editorInstance: Editor | null = null;

export function createEditor(canvas: fabric.Canvas): Editor {
  if (editorInstance) {
    editorInstance.destroy();
  }
  editorInstance = new Editor(canvas);
  return editorInstance;
}

export function getEditor(): Editor | null {
  return editorInstance;
}

export function destroyEditor() {
  if (editorInstance) {
    editorInstance.destroy();
    editorInstance = null;
  }
}
