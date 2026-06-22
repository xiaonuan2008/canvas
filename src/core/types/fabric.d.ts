import * as fabric from 'fabric';

declare module 'fabric' {
  interface Canvas {
    offHistory?: () => void;
    historyProcessing?: boolean;
    ruler?: any;
    clearHistory?: () => void;
    getCenter?: () => { left: number; top: number };
    moveObjectTo?: (object: FabricObject, index: number) => Canvas;
    rulerEnable?: () => void;
    rulerDisable?: () => void;
  }

  interface FabricObject {
    id?: string;
    name?: string;
    extensionType?: string;
    extension?: any;
    groupCopyed?: any;
    fontFamily?: string;
    axis?: 'horizontal' | 'vertical';
    checkHorizontal?: () => boolean;
    bringForward?: (intersecting?: boolean) => boolean;
    sendBackwards?: (intersecting?: boolean) => boolean;
    bringToFront?: () => boolean;
    sendToBack?: () => boolean;
    zIndex?: number;
    customId?: string;
  }

  interface Group {
    addWithUpdate?: (object?: fabric.FabricObject) => Group;
    removeAll?: () => Group;
    drain?: () => void;
    _searchPossibleTargets?: (objects: FabricObject[], pointer: Point) => FabricObject | null;
  }

  interface IText {
    groupCopyed?: any;
    enterEditing?: () => void;
    initDelayedCursor?: (start?: boolean) => void;
    isEditing?: boolean;
  }

  interface Text {
    isEditing?: boolean;
  }

  interface Textbox {
    isEditing?: boolean;
  }

  interface Image {
    clipPath?: FabricObject | null;
  }

  interface Shadow {
    color?: string;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
  }
}

declare global {
  interface Window {
    editor?: any;
  }
}

export {};
